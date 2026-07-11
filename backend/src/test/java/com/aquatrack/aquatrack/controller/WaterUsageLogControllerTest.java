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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.WaterUsageLog;
import com.aquatrack.aquatrack.enums.UsageSource;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class WaterUsageLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private WaterUsageLogRepository waterUsageLogRepository;

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
    void createWaterUsageLogSuccessfully() throws Exception {

        Household household = createHousehold();

        String request = String.format("""
        {
            "householdId": %d,
            "usageDate": "2026-07-01",
            "litersConsumed": 650
        }
        """, household.getId());

        mockMvc.perform(post("/usage-logs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.householdId").value(household.getId()))
                .andExpect(jsonPath("$.litersConsumed").value(650.0))
                .andExpect(jsonPath("$.source").value("MANUAL_ENTRY"));
    }

    @Test
    void createValidationFailure() throws Exception {

        String request = """
        {
            "litersConsumed": -50
        }
        """;

        mockMvc.perform(post("/usage-logs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllLogs() throws Exception {

        Household household = createHousehold();

        WaterUsageLog log = new WaterUsageLog();
        log.setHousehold(household);
        log.setUsageDate(LocalDate.of(2026, 7, 1));
        log.setLitersConsumed(650.0);
        log.setSource(UsageSource.MANUAL_ENTRY);

        waterUsageLogRepository.save(log);

        mockMvc.perform(get("/usage-logs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getLogById() throws Exception {

        Household household = createHousehold();

        WaterUsageLog log = new WaterUsageLog();
        log.setHousehold(household);
        log.setUsageDate(LocalDate.of(2026, 7, 1));
        log.setLitersConsumed(650.0);
        log.setSource(UsageSource.MANUAL_ENTRY);

        log = waterUsageLogRepository.save(log);

        mockMvc.perform(get("/usage-logs/" + log.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(log.getId()))
                .andExpect(jsonPath("$.householdId").value(household.getId()))
                .andExpect(jsonPath("$.litersConsumed").value(650.0));
    }

    @Test
    void getLogsByHousehold() throws Exception {

        Household household = createHousehold();

        WaterUsageLog log = new WaterUsageLog();
        log.setHousehold(household);
        log.setUsageDate(LocalDate.of(2026, 7, 1));
        log.setLitersConsumed(650.0);
        log.setSource(UsageSource.MANUAL_ENTRY);

        waterUsageLogRepository.save(log);

        mockMvc.perform(get("/usage-logs/household/" + household.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getLogNotFound() throws Exception {

        mockMvc.perform(get("/usage-logs/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Water usage log not found"));
    }
        @Test
    void updateWaterUsageLogSuccessfully() throws Exception {

        Household household = createHousehold();

        WaterUsageLog log = new WaterUsageLog();
        log.setHousehold(household);
        log.setUsageDate(LocalDate.of(2026, 7, 1));
        log.setLitersConsumed(650.0);
        log.setSource(UsageSource.MANUAL_ENTRY);

        log = waterUsageLogRepository.save(log);

        String request = String.format("""
        {
            "householdId": %d,
            "usageDate": "2026-07-02",
            "litersConsumed": 700
        }
        """, household.getId());

        mockMvc.perform(put("/usage-logs/" + log.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(log.getId()))
                .andExpect(jsonPath("$.litersConsumed").value(700.0));
    }

    @Test
    void updateWaterUsageLogNotFound() throws Exception {

        Household household = createHousehold();

        String request = String.format("""
        {
            "householdId": %d,
            "usageDate": "2026-07-02",
            "litersConsumed": 700
        }
        """, household.getId());

        mockMvc.perform(put("/usage-logs/999999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Water usage log not found"));
    }

    @Test
    void deleteWaterUsageLogSuccessfully() throws Exception {

        Household household = createHousehold();

        WaterUsageLog log = new WaterUsageLog();
        log.setHousehold(household);
        log.setUsageDate(LocalDate.of(2026, 7, 1));
        log.setLitersConsumed(650.0);
        log.setSource(UsageSource.MANUAL_ENTRY);

        log = waterUsageLogRepository.save(log);

        mockMvc.perform(delete("/usage-logs/" + log.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("Water usage log deleted successfully"));
    }

    @Test
    void deleteWaterUsageLogNotFound() throws Exception {

        mockMvc.perform(delete("/usage-logs/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Water usage log not found"));
    }

    @Test
    void uploadCsvSuccessfully() throws Exception {

        Household household = createHousehold();

        String csv = """
householdId,usageDate,litersConsumed
""" + household.getId() + ",2026-07-15,650";

        org.springframework.mock.web.MockMultipartFile file =
                new org.springframework.mock.web.MockMultipartFile(
                        "file",
                        "usage.csv",
                        "text/csv",
                        csv.getBytes());

        mockMvc.perform(multipart("/usage-logs/upload-csv")
                .file(file))
                .andExpect(status().isOk());
    }

    @Test
    void uploadEmptyCsv() throws Exception {

        org.springframework.mock.web.MockMultipartFile file =
                new org.springframework.mock.web.MockMultipartFile(
                        "file",
                        "usage.csv",
                        "text/csv",
                        new byte[0]);

        mockMvc.perform(multipart("/usage-logs/upload-csv")
                .file(file))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("CSV file is empty."));
    }

    @Test
    void uploadWrongFileType() throws Exception {

        org.springframework.mock.web.MockMultipartFile file =
                new org.springframework.mock.web.MockMultipartFile(
                        "file",
                        "usage.txt",
                        "text/plain",
                        "hello".getBytes());

        mockMvc.perform(multipart("/usage-logs/upload-csv")
                .file(file))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Please upload a .csv file."));
    }

    @Test
    void uploadInvalidCsv() throws Exception {

        Household household = createHousehold();

        String csv = """
householdId,usageDate,litersConsumed
""" + household.getId() + ",12-07-2026,650";

        org.springframework.mock.web.MockMultipartFile file =
                new org.springframework.mock.web.MockMultipartFile(
                        "file",
                        "usage.csv",
                        "text/csv",
                        csv.getBytes());

        mockMvc.perform(multipart("/usage-logs/upload-csv")
                .file(file))
                .andExpect(status().isBadRequest());
    }

}