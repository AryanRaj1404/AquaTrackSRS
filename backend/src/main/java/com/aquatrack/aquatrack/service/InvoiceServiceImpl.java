package com.aquatrack.aquatrack.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aquatrack.aquatrack.billing.BillingEngineService;
import com.aquatrack.aquatrack.billing.BillingSummary;
import com.aquatrack.aquatrack.billing.HouseholdBill;
import com.aquatrack.aquatrack.billing.InvoiceGenerator;
import com.aquatrack.aquatrack.dto.InvoiceResponse;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.BulkWaterPurchase;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.Invoice;
import com.aquatrack.aquatrack.entity.WaterUsageLog;
import com.aquatrack.aquatrack.enums.BillingCycleStatus;
import com.aquatrack.aquatrack.enums.InvoiceStatus;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.BulkWaterPurchaseRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.InvoiceRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final BillingCycleRepository billingCycleRepository;
    private final HouseholdRepository householdRepository;
    private final WaterUsageLogRepository waterUsageLogRepository;
    private final BulkWaterPurchaseRepository bulkWaterPurchaseRepository;

    private final BillingEngineService billingEngineService;
    private final InvoiceGenerator invoiceGenerator;

    public InvoiceServiceImpl(
            InvoiceRepository invoiceRepository,
            BillingCycleRepository billingCycleRepository,
            HouseholdRepository householdRepository,
            WaterUsageLogRepository waterUsageLogRepository,
            BulkWaterPurchaseRepository bulkWaterPurchaseRepository,
            BillingEngineService billingEngineService,
            InvoiceGenerator invoiceGenerator) {

        this.invoiceRepository = invoiceRepository;
        this.billingCycleRepository = billingCycleRepository;
        this.householdRepository = householdRepository;
        this.waterUsageLogRepository = waterUsageLogRepository;
        this.bulkWaterPurchaseRepository = bulkWaterPurchaseRepository;
        this.billingEngineService = billingEngineService;
        this.invoiceGenerator = invoiceGenerator;
    }

    @Override
    @Transactional
    public void generateInvoices(Long billingCycleId) {

         BillingCycle billingCycle = billingCycleRepository.findById(billingCycleId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Billing cycle not found"));

        if (billingCycle.getStatus() == BillingCycleStatus.INVOICED) {
        throw new IllegalStateException(
                "Invoices have already been generated for this billing cycle.");
        }

    // 2. Fetch all households of the apartment
    List<Household> households =
            householdRepository.findByApartmentId(
                    billingCycle.getApartment().getId());

    // 3. Fetch all bulk purchases of this billing cycle
    List<BulkWaterPurchase> purchases =
            bulkWaterPurchaseRepository.findByBillingCycle(
                    billingCycle);

    // Collections that will be used later
    List<HouseholdBill> householdBills = new ArrayList<>();
    List<Invoice> invoices = new ArrayList<>();

    for (Household household : households) {

        List<WaterUsageLog> logs =
                waterUsageLogRepository.findByBillingCycleIdAndHouseholdId(
                        billingCycleId,
                        household.getId());

        double consumption = logs.stream()
                .mapToDouble(WaterUsageLog::getLitersConsumed)
                .sum() / 1000.0;   // Convert Liters → KL

        HouseholdBill bill =
                billingEngineService.calculateHouseholdBill(
                        household.getId(),
                        consumption,
                        billingCycle.getTariffPlan());

        householdBills.add(bill);
    }

    BillingSummary summary =
        billingEngineService.summarizeBillingCycle(
                purchases,
                householdBills);

        for (HouseholdBill bill : householdBills) {

                bill.setPurchasedRate(
                        summary.getPurchasedRate());
        }

    for (int i = 0; i < households.size(); i++) {

            Invoice invoice =
                    invoiceGenerator.generate(
                            households.get(i),
                            billingCycle,
                            householdBills.get(i));

            invoices.add(invoice);
        }

        System.out.println("Invoices in list = " + invoices.size());

        System.out.println("Invoices generated: " + invoices.size());

        invoiceRepository.saveAll(invoices);

        billingCycle.setStatus(BillingCycleStatus.INVOICED);

        billingCycleRepository.save(billingCycle);

    }

    
        @Override
        @Transactional(readOnly = true)
        public List<InvoiceResponse> getInvoices(Long billingCycleId) {

        return invoiceRepository.findByBillingCycleId(billingCycleId)
                .stream()
                .map(this::toResponse)
                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<InvoiceResponse> getAll() {

        return invoiceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
        }
        @Override
        @Transactional(readOnly = true)
        public InvoiceResponse getById(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found"));

        return toResponse(invoice);
        }
        @Override
        @Transactional(readOnly = true)
        public List<InvoiceResponse> getByHousehold(Long householdId) {

        return invoiceRepository.findByHouseholdId(householdId)
                .stream()
                .map(this::toResponse)
                .toList();
        }
        @Override
        @Transactional
        public void markAsPaid(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found"));

        invoice.setStatus(InvoiceStatus.PAID);

        invoiceRepository.save(invoice);
        }
        private InvoiceResponse toResponse(Invoice invoice) {

        return new InvoiceResponse(

                invoice.getId(),

                invoice.getInvoiceNumber(),

                invoice.getHousehold().getId(),

                invoice.getHousehold().getFlatNumber(),

                invoice.getHousehold().getApartment().getId(),

                invoice.getHousehold().getApartment().getName(),

                invoice.getBillingCycle().getId(),

                invoice.getConsumptionKl(),

                invoice.getUsageCharge(),

                invoice.getFixedCharge(),

                invoice.getTariffCharge(),

                invoice.getDistributedCost(),

                invoice.getPurchasedRate(),

                invoice.getSharedAreaCharge(),

                invoice.getAdjustment(),

                invoice.getTotalAmount(),

                invoice.getStatus(),

                invoice.getGeneratedDate()
        );
        }
}