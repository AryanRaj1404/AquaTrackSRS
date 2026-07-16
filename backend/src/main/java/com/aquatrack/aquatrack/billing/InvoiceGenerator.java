package com.aquatrack.aquatrack.billing;

import org.springframework.stereotype.Component;

import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.Invoice;

@Component
public class InvoiceGenerator {

    public Invoice generate(
        Household household,
        BillingCycle billingCycle,
        HouseholdBill householdBill) {

        Invoice invoice = new Invoice();

        // Metadata
        invoice.setInvoiceNumber(
            generateInvoiceNumber(
                    billingCycle,
                    household));

        invoice.setHousehold(household);

        invoice.setBillingCycle(billingCycle);

        invoice.setGeneratedDate(java.time.LocalDate.now());

        invoice.setStatus(com.aquatrack.aquatrack.enums.InvoiceStatus.GENERATED);

        // Billing Details
        invoice.setConsumptionKl(householdBill.getConsumptionKl());

        invoice.setUsageCharge(householdBill.getUsageCharge());

        invoice.setFixedCharge(householdBill.getFixedCharge());

        invoice.setTariffCharge(householdBill.getTariffCharge());

        invoice.setDistributedCost(householdBill.getDistributedCost());

        invoice.setPurchasedRate(householdBill.getPurchasedRate());

        invoice.setSharedAreaCharge(householdBill.getSharedAreaCharge());

        invoice.setAdjustment(householdBill.getAdjustment());

        invoice.setTotalAmount(householdBill.getTotalAmount());

        return invoice;
    }

        private String generateInvoiceNumber(
            BillingCycle billingCycle,
            Household household) {

        String billingMonth =
                billingCycle.getStartDate()
                        .format(
                                java.time.format.DateTimeFormatter.ofPattern("yyyyMM"));

        return String.format(
                "INV-%s-APT%03d-HH%04d",
                billingMonth,
                household.getApartment().getId(),
                household.getId());
    }

}