package com.aquatrack.aquatrack.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApartmentResponse {
    private Long id;
    private String name;
    private String address;
}
