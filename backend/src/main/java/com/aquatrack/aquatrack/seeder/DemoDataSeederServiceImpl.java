package com.aquatrack.aquatrack.seeder;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;

@Service
public class DemoDataSeederServiceImpl implements DemoDataSeederService{

    private final ApartmentRepository apartmentRepository;
    private final RandomDataGenerator randomDataGenerator;
    private final HouseholdRepository householdRepository;

    public DemoDataSeederServiceImpl(
            ApartmentRepository apartmentRepository,
            RandomDataGenerator randomDataGenerator,
            HouseholdRepository householdRepository) {

        this.apartmentRepository = apartmentRepository;
        this.householdRepository = householdRepository;
        this.randomDataGenerator = randomDataGenerator;
    }

    private List<Apartment> generateApartments() {

        randomDataGenerator.resetGeneratedApartmentNames();

    List<Apartment> apartments = new ArrayList<>();

    for (int i = 0; i < 50; i++) {

        Apartment apartment = new Apartment();

        apartment.setName(
                randomDataGenerator.getApartmentName()
        );

        apartment.setAddress(
                randomDataGenerator.getAddress()
        );

        apartments.add(apartment);

    }

        return apartmentRepository.saveAll(apartments);

    }

    private void generateHouseholds(List<Apartment> apartments) {

    List<Household> households = new ArrayList<>();

    for (Apartment apartment : apartments) {

        int householdCount = randomDataGenerator.getHouseholdCount();

        for (int i = 1; i <= householdCount; i++) {

            Household household = new Household();

            household.setFlatNumber(
                    randomDataGenerator.getFlatNumber(i)
            );

            household.setFlatSize(
                    (double) randomDataGenerator.getFlatSize()
            );

            household.setOccupancy(
                    randomDataGenerator.getOccupancy()
            );

            household.setApartment(apartment);

            households.add(household);

        }

    }

        householdRepository.saveAll(households);

    }

    @Override
    public String generateDemoData() {

        List<Apartment> apartments = generateApartments();

        generateHouseholds(apartments);

        return "Generated "
                + apartments.size()
                + " apartments successfully.";

    }
}
