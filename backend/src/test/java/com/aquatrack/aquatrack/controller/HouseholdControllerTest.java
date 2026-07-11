package com.aquatrack.aquatrack.controller;

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
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class HouseholdControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    private Apartment createApartment() {

        Apartment apartment = new Apartment();
        apartment.setName("Green Valley");
        apartment.setAddress("Lucknow");

        return apartmentRepository.save(apartment);
    }

    @Test
    void createHouseholdSuccessfully() throws Exception {

        Apartment apartment = createApartment();

        String request = String.format("""
        {
            "flatNumber":"A-101",
            "flatSize":1200.0,
            "occupancy":4,
            "apartmentId":%d
        }
        """, apartment.getId());

        mockMvc.perform(post("/households")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.flatNumber").value("A-101"))
                .andExpect(jsonPath("$.flatSize").value(1200.0))
                .andExpect(jsonPath("$.occupancy").value(4))
                .andExpect(jsonPath("$.apartmentId").value(apartment.getId()));
    }

    @Test
    void createHouseholdValidationFailure() throws Exception {

        String request = """
        {
            "flatNumber":"",
            "flatSize":-100,
            "occupancy":0
        }
        """;

        mockMvc.perform(post("/households")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllHouseholds() throws Exception {

        Apartment apartment = createApartment();

        Household household = new Household();
        household.setFlatNumber("A-101");
        household.setFlatSize(1200.0);
        household.setOccupancy(4);
        household.setApartment(apartment);

        householdRepository.save(household);

        mockMvc.perform(get("/households"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getHouseholdById() throws Exception {

        Apartment apartment = createApartment();

        Household household = new Household();
        household.setFlatNumber("A-101");
        household.setFlatSize(1200.0);
        household.setOccupancy(4);
        household.setApartment(apartment);

        household = householdRepository.save(household);

        mockMvc.perform(get("/households/" + household.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(household.getId()))
                .andExpect(jsonPath("$.flatNumber").value("A-101"))
                .andExpect(jsonPath("$.flatSize").value(1200.0))
                .andExpect(jsonPath("$.occupancy").value(4));
    }

    @Test
    void getHouseholdNotFound() throws Exception {

        mockMvc.perform(get("/households/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Household not found"));
    }
        @Test
    void updateHouseholdSuccessfully() throws Exception {

        Apartment apartment = createApartment();

        Household household = new Household();
        household.setFlatNumber("A-101");
        household.setFlatSize(1200.0);
        household.setOccupancy(4);
        household.setApartment(apartment);

        household = householdRepository.save(household);

        String request = String.format("""
        {
            "flatNumber":"A-102",
            "flatSize":1500.0,
            "occupancy":5,
            "apartmentId":%d
        }
        """, apartment.getId());

        mockMvc.perform(put("/households/" + household.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(household.getId()))
                .andExpect(jsonPath("$.flatNumber").value("A-102"))
                .andExpect(jsonPath("$.flatSize").value(1500.0))
                .andExpect(jsonPath("$.occupancy").value(5))
                .andExpect(jsonPath("$.apartmentId").value(apartment.getId()));
    }

    @Test
    void updateHouseholdNotFound() throws Exception {

        Apartment apartment = createApartment();

        String request = String.format("""
        {
            "flatNumber":"A-102",
            "flatSize":1500.0,
            "occupancy":5,
            "apartmentId":%d
        }
        """, apartment.getId());

        mockMvc.perform(put("/households/999999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Household not found"));
    }

    @Test
    void deleteHouseholdSuccessfully() throws Exception {

        Apartment apartment = createApartment();

        Household household = new Household();
        household.setFlatNumber("A-101");
        household.setFlatSize(1200.0);
        household.setOccupancy(4);
        household.setApartment(apartment);

        household = householdRepository.save(household);

        mockMvc.perform(delete("/households/" + household.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("Household deleted successfully"));
    }

    @Test
    void deleteHouseholdNotFound() throws Exception {

        mockMvc.perform(delete("/households/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Household not found"));
    }

}