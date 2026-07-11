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
import com.aquatrack.aquatrack.repository.ApartmentRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class ApartmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Test
    void createApartmentSuccessfully() throws Exception {

        String request = """
        {
            "name":"Green Valley",
            "address":"Lucknow"
        }
        """;

        mockMvc.perform(post("/apartments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Green Valley"))
                .andExpect(jsonPath("$.address").value("Lucknow"));
    }

    @Test
    void getAllApartments() throws Exception {

        Apartment apartment = new Apartment();
        apartment.setName("Green Valley");
        apartment.setAddress("Lucknow");

        apartmentRepository.save(apartment);

        mockMvc.perform(get("/apartments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getApartmentById() throws Exception {

        Apartment apartment = new Apartment();
        apartment.setName("Green Valley");
        apartment.setAddress("Lucknow");

        apartment = apartmentRepository.save(apartment);

        mockMvc.perform(get("/apartments/" + apartment.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(apartment.getId()))
                .andExpect(jsonPath("$.name").value("Green Valley"));
    }

    @Test
    void getApartmentNotFound() throws Exception {

        mockMvc.perform(get("/apartments/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Apartment not found"));
    }

    @Test
    void updateApartmentSuccessfully() throws Exception {

        Apartment apartment = new Apartment();
        apartment.setName("Old Name");
        apartment.setAddress("Old Address");

        apartment = apartmentRepository.save(apartment);

        String request = """
        {
            "name":"Updated Apartment",
            "address":"Delhi"
        }
        """;

        mockMvc.perform(put("/apartments/" + apartment.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Apartment"))
                .andExpect(jsonPath("$.address").value("Delhi"));
    }

    @Test
    void updateApartmentNotFound() throws Exception {

        String request = """
        {
            "name":"Updated Apartment",
            "address":"Delhi"
        }
        """;

        mockMvc.perform(put("/apartments/999999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Apartment not found"));
    }

    @Test
    void deleteApartmentSuccessfully() throws Exception {

        Apartment apartment = new Apartment();
        apartment.setName("Green Valley");
        apartment.setAddress("Lucknow");

        apartment = apartmentRepository.save(apartment);

        mockMvc.perform(delete("/apartments/" + apartment.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("Apartment deleted successfully"));
    }

    @Test
    void deleteApartmentNotFound() throws Exception {

        mockMvc.perform(delete("/apartments/999999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Apartment not found"));
    }
}