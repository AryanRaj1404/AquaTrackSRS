package com.aquatrack.aquatrack.seeder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.BulkWaterPurchase;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.WaterUsageLog;
import com.aquatrack.aquatrack.enums.BillingCycleStatus;
import com.aquatrack.aquatrack.enums.PurchaseSource;
import com.aquatrack.aquatrack.enums.UsageSource;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.BulkWaterPurchaseRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@Service
public class DemoDataSeederServiceImpl implements DemoDataSeederService{

        private static final int BATCH_SIZE = 10_000;

    private final ApartmentRepository apartmentRepository;
    private final RandomDataGenerator randomDataGenerator;
    private final HouseholdRepository householdRepository;
    private final BillingCycleRepository billingCycleRepository;
    private final WaterUsageLogRepository waterUsageLogRepository;
    private final BulkWaterPurchaseRepository bulkWaterPurchaseRepository;

    public DemoDataSeederServiceImpl(
            ApartmentRepository apartmentRepository,
            RandomDataGenerator randomDataGenerator,
            HouseholdRepository householdRepository,
            BillingCycleRepository billingCycleRepository,
            WaterUsageLogRepository waterUsageLogRepository,
            BulkWaterPurchaseRepository bulkWaterPurchaseRepository
        ) {

        this.apartmentRepository = apartmentRepository;
        this.householdRepository = householdRepository;
        this.randomDataGenerator = randomDataGenerator;
        this.billingCycleRepository = billingCycleRepository;
        this.waterUsageLogRepository = waterUsageLogRepository;
        this.bulkWaterPurchaseRepository = bulkWaterPurchaseRepository;
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

    private List<BillingCycle> generateBillingCycles(
        List<Apartment> apartments) {

    List<BillingCycle> billingCycles = new ArrayList<>();

    LocalDate startDate = LocalDate.of(2026, 7, 1);
    LocalDate endDate = LocalDate.of(2026, 7, 31);

    for (Apartment apartment : apartments) {

        BillingCycle billingCycle = new BillingCycle();

        billingCycle.setApartment(apartment);

        billingCycle.setStartDate(startDate);

        billingCycle.setEndDate(endDate);

        billingCycle.setStatus(BillingCycleStatus.OPEN);

        billingCycle.setTotalAmount(0.0);

        billingCycle.setTariffPlan(null);

        billingCycles.add(billingCycle);

    }

        return billingCycleRepository.saveAll(billingCycles);

    }

    private void generateWaterUsageLogs(
        List<Apartment> apartments) {

    List<Household> households =
            householdRepository.findAll();

    List<BillingCycle> billingCycles =
            billingCycleRepository.findAll();

    Map<Long, BillingCycle> billingCycleMap =
            new HashMap<>();

    for (BillingCycle billingCycle : billingCycles) {

        billingCycleMap.put(

                billingCycle
                        .getApartment()
                        .getId(),

                billingCycle

        );

    }

    List<WaterUsageLog> logs = new ArrayList<>();

    for (Household household : households) {

        BillingCycle billingCycle =
                billingCycleMap.get(
                        household
                                .getApartment()
                                .getId()
                );

        LocalDate currentDate =
                billingCycle.getStartDate();

        while (!currentDate.isAfter(
                billingCycle.getEndDate())) {

            WaterUsageLog log =
                    new WaterUsageLog();

            log.setHousehold(household);

            log.setBillingCycle(
                    billingCycle
            );

            log.setUsageDate(currentDate);

            log.setSource(
                    UsageSource.MANUAL_ENTRY
            );

            log.setLitersConsumed(

                    randomDataGenerator
                            .getDailyWaterUsage(

                                    household
                                            .getOccupancy()

                            )

            );

            logs.add(log);

            if (logs.size() >= BATCH_SIZE) {

                waterUsageLogRepository.saveAll(logs);

                logs.clear();

        }

            currentDate =
                    currentDate.plusDays(1);

        }

    }

    if (!logs.isEmpty()) {

        waterUsageLogRepository.saveAll(logs);

        }       

}
        private void generateBulkWaterPurchases() {

    List<BillingCycle> billingCycles =
            billingCycleRepository.findAll();

    List<BulkWaterPurchase> purchases =
            new ArrayList<>();

    for (BillingCycle billingCycle : billingCycles) {

        int purchaseCount =
                randomDataGenerator
                        .getPurchaseCount();

        for (int i = 0;
             i < purchaseCount;
             i++) {

            BulkWaterPurchase purchase =
                    new BulkWaterPurchase();

            purchase.setApartment(
                    billingCycle.getApartment()
            );

            purchase.setBillingCycle(
                    billingCycle
            );

            purchase.setPurchaseDate(

                    randomDataGenerator
                            .getPurchaseDate(

                                    billingCycle.getStartDate(),

                                    billingCycle.getEndDate()

                            )

            );

            purchase.setSource(
                    PurchaseSource.MUNICIPAL
            );

            double volume =
                    randomDataGenerator
                            .getPurchaseVolumeKl();

            double unitCost =
                    randomDataGenerator
                            .getUnitCost();

            purchase.setVolumeKl(volume);

            purchase.setUnitCost(unitCost);

            purchase.setTotalCost(
                    volume * unitCost
            );

            purchase.setSupplier(

                    randomDataGenerator
                            .getSupplier()

            );

            purchases.add(purchase);

        }

    }

    bulkWaterPurchaseRepository.saveAll(
            purchases
    );

}

private List<BillingCycle> generateAugustBillingCycles() {

    List<Apartment> apartments =
            apartmentRepository.findAll();

    List<BillingCycle> billingCycles =
            new ArrayList<>();

    for (Apartment apartment : apartments) {

        BillingCycle billingCycle =
                new BillingCycle();

        billingCycle.setApartment(apartment);

        billingCycle.setStartDate(
                LocalDate.of(2026, 8, 1));

        billingCycle.setEndDate(
                LocalDate.of(2026, 8, 31));

        billingCycle.setStatus(
                BillingCycleStatus.OPEN);

        billingCycle.setTotalAmount(0.0);

        billingCycle.setTariffPlan(null);

        billingCycles.add(billingCycle);
    }

    return billingCycleRepository.saveAll(
            billingCycles
    );
}

private void generateAugustUsageLogs() {

    List<Household> households =
            householdRepository.findAll();

    List<BillingCycle> augustCycles =
            billingCycleRepository.findAll()
                    .stream()
                    .filter(cycle ->

                        cycle.getStartDate().equals(
                                LocalDate.of(2026,8,1)
                        )

                    )
                    .toList();

    Map<Long, BillingCycle> cycleMap =
            new HashMap<>();

    for (BillingCycle cycle : augustCycles) {

        cycleMap.put(

                cycle.getApartment().getId(),

                cycle

        );

    }

    List<WaterUsageLog> logs =
            new ArrayList<>();

    LocalDate endDate =
            LocalDate.of(2026,8,7);

    for (Household household : households) {

        BillingCycle cycle =
                cycleMap.get(
                        household.getApartment().getId()
                );

        LocalDate current =
                LocalDate.of(2026,8,1);

        while (!current.isAfter(endDate)) {

            WaterUsageLog log =
                    new WaterUsageLog();

            log.setHousehold(household);

            log.setBillingCycle(cycle);

            log.setUsageDate(current);

            log.setSource(
                    UsageSource.MANUAL_ENTRY
            );

            log.setLitersConsumed(

                    randomDataGenerator
                            .getDailyWaterUsage(
                                    household.getOccupancy()
                            )

            );

            logs.add(log);

            if (logs.size() >= BATCH_SIZE) {

                waterUsageLogRepository.saveAll(logs);

                logs.clear();

            }

            current = current.plusDays(1);

        }

    }

    if (!logs.isEmpty()) {

        waterUsageLogRepository.saveAll(logs);

    }

}

private void generateAugustBulkWaterPurchases() {

    List<BillingCycle> augustCycles =
            billingCycleRepository.findAll()
                    .stream()
                    .filter(cycle ->

                        cycle.getStartDate().equals(
                                LocalDate.of(2026,8,1)
                        )

                    )
                    .toList();

    List<BulkWaterPurchase> purchases =
            new ArrayList<>();

    for (BillingCycle cycle : augustCycles) {

        int purchaseCount =
                randomDataGenerator
                        .getPurchaseCount();

        for (int i = 0; i < purchaseCount; i++) {

            BulkWaterPurchase purchase =
                    new BulkWaterPurchase();

            purchase.setApartment(
                    cycle.getApartment()
            );

            purchase.setBillingCycle(cycle);

            purchase.setPurchaseDate(

                    randomDataGenerator.getPurchaseDate(

                            LocalDate.of(2026,8,1),

                            LocalDate.of(2026,8,7)

                    )

            );

            purchase.setSource(
                    PurchaseSource.MUNICIPAL
            );

            double volume =
                    randomDataGenerator
                            .getPurchaseVolumeKl();

            double unitCost =
                    randomDataGenerator
                            .getUnitCost();

            purchase.setVolumeKl(volume);

            purchase.setUnitCost(unitCost);

            purchase.setTotalCost(
                    volume * unitCost
            );

            purchase.setSupplier(
                    randomDataGenerator
                            .getSupplier()
            );

            purchases.add(purchase);

        }

    }

    bulkWaterPurchaseRepository.saveAll(
            purchases
    );

}

@Override
public String generateAugustDemoData() {

    generateAugustBillingCycles();

    generateAugustUsageLogs();

    generateAugustBulkWaterPurchases();

    return "August demo data generated successfully.";

}



    @Override
    public String generateDemoData() {

        List<Apartment> apartments = generateApartments();

        generateHouseholds(apartments);

        generateBillingCycles(apartments);

        generateWaterUsageLogs(apartments);

        generateBulkWaterPurchases();

        return "Generated "
                + apartments.size()
                + " apartments with billing cycle successfully.";

    }
}
