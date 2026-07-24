package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApartmentResponse {
    private Long id;
    private String name;
    private String address;
    private Integer householdCount;
}
