package com.aquatrack.aquatrack.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminAlertSummaryResponse {

    private long critical;

    private long pending;

    private long acknowledged;

    private long total;

}