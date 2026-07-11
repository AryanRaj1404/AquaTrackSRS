package com.aquatrack.aquatrack.controller;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.Meter;
import com.aquatrack.aquatrack.enums.MeterType;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.MeterRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class MeterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private MeterRepository meterRepository;

    private Household createHousehold() {

        Apartment apartment = new Apartment();
        apartment.setName("Green Valley");
        apartment.setAddress("Lucknow");
        apartment = apartmentRepository.save(apartment);

        Household household = new Household();
        household.setFlatNumber("A-101");
        household.setFlatSize(1200.0);
        household.setOccupancy(4);
        household.setApartment(apartment);

        return householdRepository.save(household);
    }

    @Test
    void createMeterSuccessfully() throws Exception {

        Household household = createHousehold();

        String request = String.format("""
        {
            "meterNumber":"MTR-1001",
            "meterType":"DIGITAL",
            "installedDate":"2026-07-01",
            "householdId":%d
        }
        """, household.getId());

        mockMvc.perform(post("/meters")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.meterNumber").value("MTR-1001"))
                .andExpect(jsonPath("$.meterType").value("DIGITAL"))
                .andExpect(jsonPath("$.householdId").value(household.getId()));
    }

    @Test
    void createMeterValidationFailure() throws Exception {

        String request = """
        {
            "meterNumber":"",
            "meterType":null,
            "installedDate":null
        }
        """;

        mockMvc.perform(post("/meters")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllMeters() throws Exception {

        Household household = createHousehold();

        Meter meter = new Meter();
        meter.setMeterNumber("MTR-1001");
        meter.setMeterType(MeterType.DIGITAL);
        meter.setInstalledDate(LocalDate.of(2026,7,1));
        meter.setActive(true);
        meter.setHousehold(household);

        meterRepository.save(meter);

        mockMvc.perform(get("/meters"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getMeterById() throws Exception {

        Household household = createHousehold();

        Meter meter = new Meter();
        meter.setMeterNumber("MTR-1001");
        meter.setMeterType(MeterType.DIGITAL);
        meter.setInstalledDate(LocalDate.of(2026,7,1));
        meter.setActive(true);
        meter.setHousehold(household);

        meter = meterRepository.save(meter);

        mockMvc.perform(get("/meters/" + meter.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(meter.getId()))
                .andExpect(jsonPath("$.meterNumber").value("MTR-1001"))
                .andExpect(jsonPath("$.meterType").value("DIGITAL"));
    }

    @Test
    void getMeterNotFound() throws Exception {

        mockMvc.perform(get("/meters/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Meter not found"));
    }

    @Test
    void getMetersByHousehold() throws Exception {

        Household household = createHousehold();

        Meter meter = new Meter();
        meter.setMeterNumber("MTR-1001");
        meter.setMeterType(MeterType.DIGITAL);
        meter.setInstalledDate(LocalDate.of(2026,7,1));
        meter.setActive(true);
        meter.setHousehold(household);

        meterRepository.save(meter);

        mockMvc.perform(get("/meters/household/" + household.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
        @Test
    void updateMeterSuccessfully() throws Exception {

        Household household = createHousehold();

        Meter meter = new Meter();
        meter.setMeterNumber("MTR-1001");
        meter.setMeterType(MeterType.DIGITAL);
        meter.setInstalledDate(LocalDate.of(2026, 7, 1));
        meter.setActive(true);
        meter.setHousehold(household);

        meter = meterRepository.save(meter);

        String request = String.format("""
        {
            "meterNumber":"MTR-2001",
            "meterType":"SMART",
            "installedDate":"2026-08-15",
            "householdId":%d
        }
        """, household.getId());

        mockMvc.perform(put("/meters/" + meter.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(meter.getId()))
                .andExpect(jsonPath("$.meterNumber").value("MTR-2001"))
                .andExpect(jsonPath("$.meterType").value("SMART"))
                .andExpect(jsonPath("$.householdId").value(household.getId()));
    }

    @Test
    void updateMeterNotFound() throws Exception {

        Household household = createHousehold();

        String request = String.format("""
        {
            "meterNumber":"MTR-2001",
            "meterType":"SMART",
            "installedDate":"2026-08-15",
            "householdId":%d
        }
        """, household.getId());

        mockMvc.perform(put("/meters/999999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Meter not found"));
    }

    @Test
    void deleteMeterSuccessfully() throws Exception {

        Household household = createHousehold();

        Meter meter = new Meter();
        meter.setMeterNumber("MTR-1001");
        meter.setMeterType(MeterType.DIGITAL);
        meter.setInstalledDate(LocalDate.of(2026, 7, 1));
        meter.setActive(true);
        meter.setHousehold(household);

        meter = meterRepository.save(meter);

        mockMvc.perform(delete("/meters/" + meter.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("Meter deleted successfully"));
    }

    @Test
    void deleteMeterNotFound() throws Exception {

        mockMvc.perform(delete("/meters/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Meter not found"));
    }

}