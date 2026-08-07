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
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.TariffPlan;
import com.aquatrack.aquatrack.enums.BillingCycleStatus;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.TariffPlanRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class BillingCycleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BillingCycleRepository billingCycleRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private TariffPlanRepository tariffPlanRepository;

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

    private TariffPlan createTariffPlan() {

        TariffPlan tariffPlan = new TariffPlan();

        tariffPlan.setPlanName("Standard");
        tariffPlan.setFixedCharge(200.0);
        tariffPlan.setEffectiveFrom(LocalDate.of(2026,1,1));
        tariffPlan.setEffectiveTo(LocalDate.of(2026,12,31));
        tariffPlan.setDescription("Default Plan");

        return tariffPlanRepository.save(tariffPlan);
    }

    @Test
    void createBillingCycleSuccessfully() throws Exception {

        Household household = createHousehold();
        TariffPlan tariffPlan = createTariffPlan();

        String request = String.format("""
        {
            "startDate":"2026-07-01",
            "endDate":"2026-07-31",
            "totalAmount":1500,
            "status":"OPEN",
            "householdId":%d,
            "tariffPlanId":%d
        }
        """, household.getId(), tariffPlan.getId());

        mockMvc.perform(post("/billing-cycles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.householdId").value(household.getId()))
                .andExpect(jsonPath("$.tariffPlanId").value(tariffPlan.getId()))
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    void createValidationFailure() throws Exception {

        String request = """
        {
            "totalAmount":1500
        }
        """;

        mockMvc.perform(post("/billing-cycles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllBillingCycles() throws Exception {

        TariffPlan tariffPlan = createTariffPlan();

        BillingCycle billingCycle = new BillingCycle();
        billingCycle.setStartDate(LocalDate.of(2026,7,1));
        billingCycle.setEndDate(LocalDate.of(2026,7,31));
        billingCycle.setTotalAmount(1500.0);
        billingCycle.setStatus(BillingCycleStatus.OPEN);
        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("ABC Residency");

        billingCycle.setApartment(apartment);
        billingCycle.setTariffPlan(tariffPlan);

        billingCycleRepository.save(billingCycle);

        mockMvc.perform(get("/billing-cycles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getBillingCycleById() throws Exception {

        Household household = createHousehold();
        TariffPlan tariffPlan = createTariffPlan();

        BillingCycle billingCycle = new BillingCycle();
        billingCycle.setStartDate(LocalDate.of(2026,7,1));
        billingCycle.setEndDate(LocalDate.of(2026,7,31));
        billingCycle.setTotalAmount(1500.0);
        billingCycle.setStatus(BillingCycleStatus.OPEN);
        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("ABC Residency");

        billingCycle.setApartment(apartment);
        billingCycle.setTariffPlan(tariffPlan);

        billingCycle = billingCycleRepository.save(billingCycle);

        mockMvc.perform(get("/billing-cycles/" + billingCycle.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(billingCycle.getId()))
                .andExpect(jsonPath("$.householdId").value(household.getId()))
                .andExpect(jsonPath("$.tariffPlanId").value(tariffPlan.getId()));
    }

    @Test
    void getBillingCycleNotFound() throws Exception {

        mockMvc.perform(get("/billing-cycles/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Billing cycle not found"));
    }

    @Test
    void getBillingCyclesByHousehold() throws Exception {

        Household household = createHousehold();
        TariffPlan tariffPlan = createTariffPlan();

        BillingCycle billingCycle = new BillingCycle();
        billingCycle.setStartDate(LocalDate.of(2026,7,1));
        billingCycle.setEndDate(LocalDate.of(2026,7,31));
        billingCycle.setTotalAmount(1500.0);
        billingCycle.setStatus(BillingCycleStatus.OPEN);
        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("ABC Residency");

        billingCycle.setApartment(apartment);
        billingCycle.setTariffPlan(tariffPlan);

        billingCycleRepository.save(billingCycle);

        mockMvc.perform(get("/billing-cycles/household/" + household.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
        @Test
    void updateBillingCycleSuccessfully() throws Exception {

        Household household = createHousehold();
        TariffPlan tariffPlan = createTariffPlan();

        BillingCycle billingCycle = new BillingCycle();
        billingCycle.setStartDate(LocalDate.of(2026, 7, 1));
        billingCycle.setEndDate(LocalDate.of(2026, 7, 31));
        billingCycle.setTotalAmount(1500.0);
        billingCycle.setStatus(BillingCycleStatus.OPEN);
        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("ABC Residency");

        billingCycle.setApartment(apartment);
        billingCycle.setTariffPlan(tariffPlan);

        billingCycle = billingCycleRepository.save(billingCycle);

        String request = String.format("""
        {
            "startDate":"2026-08-01",
            "endDate":"2026-08-31",
            "totalAmount":1800,
            "status":"CLOSED",
            "householdId":%d,
            "tariffPlanId":%d
        }
        """, household.getId(), tariffPlan.getId());

        mockMvc.perform(put("/billing-cycles/" + billingCycle.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(billingCycle.getId()))
                .andExpect(jsonPath("$.status").value("CLOSED"))
                .andExpect(jsonPath("$.totalAmount").value(1800.0));
    }

    @Test
    void updateBillingCycleNotFound() throws Exception {

        Household household = createHousehold();
        TariffPlan tariffPlan = createTariffPlan();

        String request = String.format("""
        {
            "startDate":"2026-08-01",
            "endDate":"2026-08-31",
            "totalAmount":1800,
            "status":"CLOSED",
            "householdId":%d,
            "tariffPlanId":%d
        }
        """, household.getId(), tariffPlan.getId());

        mockMvc.perform(put("/billing-cycles/999999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Billing cycle not found"));
    }

    @Test
    void deleteBillingCycleSuccessfully() throws Exception {
        
        TariffPlan tariffPlan = createTariffPlan();

        BillingCycle billingCycle = new BillingCycle();
        billingCycle.setStartDate(LocalDate.of(2026, 7, 1));
        billingCycle.setEndDate(LocalDate.of(2026, 7, 31));
        billingCycle.setTotalAmount(1500.0);
        billingCycle.setStatus(BillingCycleStatus.OPEN);
        Apartment apartment = new Apartment();
        apartment.setId(1L);
        apartment.setName("ABC Residency");

        billingCycle.setApartment(apartment);
        billingCycle.setTariffPlan(tariffPlan);

        billingCycle = billingCycleRepository.save(billingCycle);

        mockMvc.perform(delete("/billing-cycles/" + billingCycle.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("Billing cycle deleted successfully"));
    }

    @Test
    void deleteBillingCycleNotFound() throws Exception {

        mockMvc.perform(delete("/billing-cycles/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Billing cycle not found"));
    }

}