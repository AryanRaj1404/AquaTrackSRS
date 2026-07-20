package com.aquatrack.aquatrack.billing;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HouseholdBill {

    private Long householdId;

    private Double consumptionKl;

    private Double usageCharge;

    private Double fixedCharge;

    private Double adjustment;

    private Double totalAmount;

    private Double tariffCharge;

    private Double distributedCost;

    private Double purchasedRate;

    private Double sharedAreaCharge;
}