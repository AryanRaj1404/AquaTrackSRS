package com.aquatrack.aquatrack.seeder;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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

    private final List<String> suppliers = List.of(

        "Aqua Tankers",

        "Blue Water Supply",

        "Crystal Water Services",

        "FreshDrop Tankers",

        "City Water Logistics"

    );

    public int getPurchaseCount() {

        return random.nextInt(4) + 2;

    }

    public double getPurchaseVolumeKl() {

        return 80 + random.nextInt(121);

    }   

    public double getUnitCost() {

        return 85 + random.nextInt(21);

    }

    public String getSupplier() {

        return suppliers.get(

                random.nextInt(
                        suppliers.size()
                )

        );

    }

    public LocalDate getPurchaseDate(
        LocalDate start,
        LocalDate end) {

        int days =

                (int)
                ChronoUnit.DAYS.between(
                        start,
                        end
                );

        return start.plusDays(

                random.nextInt(days + 1)

        );

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

    public double getDailyWaterUsage(int occupancy) {

    int minimum;
    int maximum;

    switch (occupancy) {

        case 1 -> {
            minimum = 120;
            maximum = 180;
        }

        case 2 -> {
            minimum = 180;
            maximum = 260;
        }

        case 3 -> {
            minimum = 240;
            maximum = 340;
        }

        case 4 -> {
            minimum = 300;
            maximum = 420;
        }

        default -> {
            minimum = 350;
            maximum = 480;
        }

    }

    double usage =
            minimum +
            random.nextDouble() *
            (maximum - minimum);

    /*
        5% chance of abnormal usage
    */

    if (random.nextInt(100) < 5) {

        usage = 520 + random.nextDouble() * 180;

    }

    return Math.round(usage);

}
}