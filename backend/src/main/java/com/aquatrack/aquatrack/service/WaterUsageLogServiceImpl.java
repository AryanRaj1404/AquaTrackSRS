package com.aquatrack.aquatrack.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aquatrack.aquatrack.dto.CsvRowError;
import com.aquatrack.aquatrack.dto.UploadCsvResponse;
import com.aquatrack.aquatrack.dto.WaterUsageLogRequest;
import com.aquatrack.aquatrack.dto.WaterUsageLogResponse;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.WaterUsageLog;
import com.aquatrack.aquatrack.enums.UsageSource;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@Service
public class WaterUsageLogServiceImpl implements WaterUsageLogService {

    private final WaterUsageLogRepository waterUsageLogRepository;
    private final HouseholdRepository householdRepository;
    private final BillingCycleRepository billingCycleRepository;

    public WaterUsageLogServiceImpl(
            WaterUsageLogRepository waterUsageLogRepository,
            HouseholdRepository householdRepository,
            BillingCycleRepository billingCycleRepository
        ) {

        this.waterUsageLogRepository = waterUsageLogRepository;
        this.householdRepository = householdRepository;
        this.billingCycleRepository = billingCycleRepository;
    }

    @Override
public WaterUsageLogResponse create(
        Long apartmentId,
        WaterUsageLogRequest request
) {

    if (waterUsageLogRepository.existsByHouseholdIdAndUsageDate(
            request.getHouseholdId(),
            request.getUsageDate())) {

        throw new IllegalArgumentException(
                "A water usage log already exists for this household on "
                        + request.getUsageDate());
    }

    Household household = householdRepository.findById(request.getHouseholdId())
            .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

    if (apartmentId != null &&
            !household.getApartment().getId().equals(apartmentId)) {

        throw new ResourceNotFoundException("Household not found");
    }

    BillingCycle billingCycle = null;

    if (request.getBillingCycleId() != null) {

        billingCycle = billingCycleRepository.findById(request.getBillingCycleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Billing cycle not found"));

        if (apartmentId != null &&
                !billingCycle.getApartment().getId().equals(apartmentId)) {

            throw new ResourceNotFoundException("Billing cycle not found");
        }
    }

    if (billingCycle != null &&
            (request.getUsageDate().isBefore(billingCycle.getStartDate())
                    || request.getUsageDate().isAfter(billingCycle.getEndDate()))) {

        throw new IllegalArgumentException(
                "Usage date is outside the selected billing cycle.");
    }

    WaterUsageLog log = new WaterUsageLog();

    log.setHousehold(household);
    log.setUsageDate(request.getUsageDate());
    log.setLitersConsumed(request.getLitersConsumed());
    log.setSource(UsageSource.MANUAL_ENTRY);
    log.setBillingCycle(billingCycle);

    return toResponse(waterUsageLogRepository.save(log));
}

    @Override
public Page<WaterUsageLogResponse> getAll(
        Long apartmentId,
        String keyword,
        Pageable pageable
) {

    Page<WaterUsageLog> page;

    if (apartmentId == null) {

        if (keyword == null || keyword.isBlank()) {

            page = waterUsageLogRepository.findAll(pageable);

        } else {

            page = waterUsageLogRepository
                    .findByHousehold_FlatNumberContainingIgnoreCaseOrHousehold_Apartment_NameContainingIgnoreCase(
                            keyword,
                            keyword,
                            pageable
                    );
        }

    } else {

        if (keyword == null || keyword.isBlank()) {

            page = waterUsageLogRepository.findByHousehold_Apartment_Id(
                    apartmentId,
                    pageable
            );

        } else {

            page = waterUsageLogRepository
                    .findByHousehold_Apartment_IdAndHousehold_FlatNumberContainingIgnoreCaseOrHousehold_Apartment_IdAndHousehold_Apartment_NameContainingIgnoreCase(
                            apartmentId,
                            keyword,
                            apartmentId,
                            keyword,
                            pageable
                    );
        }
    }

    return page.map(this::toResponse);
}

    @Override
    public WaterUsageLogResponse getById(Long id) {

        WaterUsageLog log = waterUsageLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Water usage log not found"));

        return toResponse(log);
    }

    @Override
    public List<WaterUsageLogResponse> getByHousehold(Long householdId) {

        return waterUsageLogRepository.findByHouseholdId(householdId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
public WaterUsageLogResponse update(
        Long apartmentId,
        Long id,
        WaterUsageLogRequest request
) {

    WaterUsageLog log = waterUsageLogRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Water usage log not found"));

    if (apartmentId != null &&
            !log.getHousehold().getApartment().getId().equals(apartmentId)) {

        throw new ResourceNotFoundException("Water usage log not found");
    }

    Household household = householdRepository.findById(request.getHouseholdId())
            .orElseThrow(() ->
                    new ResourceNotFoundException("Household not found"));

    if (apartmentId != null &&
            !household.getApartment().getId().equals(apartmentId)) {

        throw new ResourceNotFoundException("Household not found");
    }

    if (waterUsageLogRepository.existsByHouseholdIdAndUsageDateAndIdNot(
            request.getHouseholdId(),
            request.getUsageDate(),
            id)) {

        throw new IllegalArgumentException(
                "A water usage log already exists for this household on "
                        + request.getUsageDate());
    }

    BillingCycle billingCycle = null;

    if (request.getBillingCycleId() != null) {

        billingCycle = billingCycleRepository.findById(request.getBillingCycleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Billing cycle not found"));

        if (apartmentId != null &&
                !billingCycle.getApartment().getId().equals(apartmentId)) {

            throw new ResourceNotFoundException("Billing cycle not found");
        }
    }

    log.setHousehold(household);
    log.setUsageDate(request.getUsageDate());
    log.setLitersConsumed(request.getLitersConsumed());
    log.setBillingCycle(billingCycle);

    return toResponse(waterUsageLogRepository.save(log));
}


@Override
public void delete(
        Long apartmentId,
        Long id
) {

    WaterUsageLog log = waterUsageLogRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Water usage log not found"));

    if (apartmentId != null &&
            !log.getHousehold().getApartment().getId().equals(apartmentId)) {

        throw new ResourceNotFoundException("Water usage log not found");
    }

    waterUsageLogRepository.delete(log);
}
@Override
public UploadCsvResponse uploadCsv(
        Long apartmentId,
        MultipartFile file,
        Long billingCycleId
) {

    if (file.isEmpty()) {
        throw new IllegalArgumentException("CSV file is empty.");
    }

    String fileName = file.getOriginalFilename();

    if (fileName == null ||
            !fileName.toLowerCase().endsWith(".csv")) {

        throw new IllegalArgumentException(
                "Please upload a .csv file.");
    }

    BillingCycle billingCycle =
            billingCycleRepository.findById(billingCycleId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Billing cycle not found"));

    if (apartmentId != null &&
            !billingCycle.getApartment().getId().equals(apartmentId)) {

        throw new ResourceNotFoundException("Billing cycle not found");
    }

    List<CsvRowError> errors = new ArrayList<>();

    int totalRows = 0;
    int importedRows = 0;

    try (BufferedReader reader =
                 new BufferedReader(
                         new InputStreamReader(
                                 file.getInputStream(),
                                 StandardCharsets.UTF_8))) {

        reader.readLine();

        String line;

        while ((line = reader.readLine()) != null) {

            totalRows++;

            try {

                String[] parts = line.split(",");

                if (parts.length != 3) {
                    throw new IllegalArgumentException(
                            "Invalid CSV format.");
                }

                Long householdId =
                        Long.parseLong(parts[0].trim());

                LocalDate usageDate =
                        LocalDate.parse(parts[1].trim());

                Double litersConsumed =
                        Double.parseDouble(parts[2].trim());

                WaterUsageLogRequest request =
                        new WaterUsageLogRequest();

                request.setHouseholdId(householdId);
                request.setBillingCycleId(billingCycle.getId());
                request.setUsageDate(usageDate);
                request.setLitersConsumed(litersConsumed);

                create(apartmentId, request);

                importedRows++;

            }

            catch (NumberFormatException ex) {

                errors.add(new CsvRowError(
                        totalRows,
                        "Invalid household id or liters consumed."
                ));

            }

            catch (DateTimeParseException ex) {

                errors.add(new CsvRowError(
                        totalRows,
                        "Invalid date format."
                ));

            }

            catch (Exception ex) {

                errors.add(new CsvRowError(
                        totalRows,
                        ex.getMessage()
                ));

            }

        }

    }

    catch (IOException ex) {

        throw new RuntimeException(
                "Unable to read CSV file.",
                ex);

    }

    return new UploadCsvResponse(
            totalRows,
            importedRows,
            errors.size(),
            errors
    );
}

    private WaterUsageLogResponse toResponse(WaterUsageLog log) {

        return new WaterUsageLogResponse(
                log.getId(),
                log.getHousehold().getId(),
                log.getHousehold().getFlatNumber(),
                log.getHousehold().getApartment().getName(),
                log.getUsageDate(),
                log.getLitersConsumed(),
                log.getSource().name(),
                log.getBillingCycle() != null
                        ? log.getBillingCycle().getId()
                        : null);
    }
}