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

import com.aquatrack.aquatrack.entity.TariffPlan;
import com.aquatrack.aquatrack.repository.TariffPlanRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class TariffPlanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TariffPlanRepository tariffPlanRepository;

    private TariffPlan createTariffPlan() {

        TariffPlan tariffPlan = new TariffPlan();

        tariffPlan.setPlanName("Standard Plan");
        tariffPlan.setFixedCharge(250.0);
        tariffPlan.setEffectiveFrom(LocalDate.of(2026, 1, 1));
        tariffPlan.setEffectiveTo(LocalDate.of(2026, 12, 31));
        tariffPlan.setDescription("Default tariff");

        return tariffPlanRepository.save(tariffPlan);
    }

    @Test
    void createTariffPlanSuccessfully() throws Exception {

        String request = """
            {
                "planName":"Premium Plan",
                "fixedCharge":300,
                "effectiveFrom":"2026-01-01",
                "effectiveTo":"2026-12-31",
                "description":"Premium tariff",
                "tiers":[
                    {
                        "tierOrder":1,
                        "uptoKl":10,
                        "ratePerKl":15.5
                    },
                    {
                        "tierOrder":2,
                        "uptoKl":null,
                        "ratePerKl":20.0
                    }
                ]
            }
            """;

        mockMvc.perform(post("/tariff-plans")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.planName").value("Premium Plan"))
                .andExpect(jsonPath("$.tiers[0].ratePerKl").value(15.5))
                .andExpect(jsonPath("$.tiers[1].ratePerKl").value(20.0))
                .andExpect(jsonPath("$.fixedCharge").value(300.0));
    }

    @Test
    void createValidationFailure() throws Exception {

        String request = """
        {
            "planName":"",
            "fixedCharge":-100,
            "tiers":[]
        }
        """;

        mockMvc.perform(post("/tariff-plans")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllTariffPlans() throws Exception {

        createTariffPlan();

        mockMvc.perform(get("/tariff-plans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getTariffPlanById() throws Exception {

        TariffPlan tariffPlan = createTariffPlan();

        mockMvc.perform(get("/tariff-plans/" + tariffPlan.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(tariffPlan.getId()))
                .andExpect(jsonPath("$.planName").value("Standard Plan"));
    }

    @Test
    void getTariffPlanNotFound() throws Exception {

        mockMvc.perform(get("/tariff-plans/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Tariff plan not found"));
    }

    @Test
    void updateTariffPlanSuccessfully() throws Exception {

        TariffPlan tariffPlan = createTariffPlan();

        String request = """
        {
            "planName":"Updated Plan",
            "fixedCharge":350,
            "effectiveFrom":"2026-02-01",
            "effectiveTo":"2026-12-31",
            "description":"Updated tariff",
            "tiers":[
                {
                    "tierOrder":1,
                    "uptoKl":10,
                    "ratePerKl":20.0
                },
                {
                    "tierOrder":2,
                    "uptoKl":null,
                    "ratePerKl":25.0
                }
            ]
        }
        """;

        mockMvc.perform(put("/tariff-plans/" + tariffPlan.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planName").value("Updated Plan"))
                .andExpect(jsonPath("$.tiers[0].ratePerKl").value(20.0))
                .andExpect(jsonPath("$.tiers[1].ratePerKl").value(25.0))
                .andExpect(jsonPath("$.fixedCharge").value(350.0));
    }

    @Test
    void updateTariffPlanNotFound() throws Exception {

        String request = """
        {
            "planName":"Updated Plan",
            "fixedCharge":350,
            "effectiveFrom":"2026-02-01",
            "effectiveTo":"2026-12-31",
            "description":"Updated tariff",
            "tiers":[
                {
                    "tierOrder":1,
                    "uptoKl":10,
                    "ratePerKl":20.0
                },
                {
                    "tierOrder":2,
                    "uptoKl":null,
                    "ratePerKl":25.0
                }
            ]
        }
        """;

        mockMvc.perform(put("/tariff-plans/999999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Tariff plan not found"));
    }

    @Test
    void deleteTariffPlanSuccessfully() throws Exception {

        TariffPlan tariffPlan = createTariffPlan();

        mockMvc.perform(delete("/tariff-plans/" + tariffPlan.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("Tariff plan deleted successfully"));
    }

    @Test
    void deleteTariffPlanNotFound() throws Exception {

        mockMvc.perform(delete("/tariff-plans/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Tariff plan not found"));
    }
}