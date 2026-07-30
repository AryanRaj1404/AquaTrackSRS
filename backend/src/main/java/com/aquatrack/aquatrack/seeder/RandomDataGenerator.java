package com.aquatrack.aquatrack.seeder;

import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import org.springframework.stereotype.Component;

@Component
public class RandomDataGenerator {

    private final Set<String> generatedApartmentNames = new HashSet<>();

    private final Random random = new Random();
    private final List<Integer> flatSizes = List.of(
        650,
        750,
        850,
        950,
        1100,
        1250,
        1400,
        1600
    );

    public int getFlatSize() {

        return flatSizes.get(
                random.nextInt(flatSizes.size())
        );

    }

    public void resetGeneratedApartmentNames() {
        generatedApartmentNames.clear();
    }

    public int getOccupancy() {

        return random.nextInt(5) + 1;

    }

    private final List<String> prefixes = List.of(
            "Green", "Blue", "Silver", "Golden", "Palm",
            "River", "Lake", "Sky", "Emerald", "Crystal",
            "Royal", "Sunrise", "Sunset", "Oak", "Maple",
            "Elite", "Harmony", "Grand", "Hill", "Park"
    );

    private final List<String> suffixes = List.of(
            "Heights", "Residency", "Residences", "Towers",
            "Gardens", "View", "Enclave", "Plaza",
            "County", "Homes", "Estate", "Apartments"
    );

    private final List<String> cities = List.of(
            "Noida",
            "Greater Noida",
            "Ghaziabad",
            "Delhi",
            "Gurugram",
            "Faridabad"
    );

    public String getApartmentName() {

        String apartmentName;

        do {

            apartmentName =
                    prefixes.get(random.nextInt(prefixes.size()))
                    + " "
                    + suffixes.get(random.nextInt(suffixes.size()));

        } while (!generatedApartmentNames.add(apartmentName));

        return apartmentName;
    }

    public String getAddress() {

        return "Sector "
                + (random.nextInt(120) + 1)
                + ", "
                + cities.get(random.nextInt(cities.size()));
    }

    public String getFlatNumber(int flatIndex) {
        char block = (char) ('A' + ((flatIndex - 1) / 50));
        return block + "-" + String.format("%03d", flatIndex);
    }

    public int getHouseholdCount() {

        return random.nextInt(101) + 100;

    }
}