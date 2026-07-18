package com.aquatrack.aquatrack.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UploadCsvResponse {

    private int totalRows;

    private int importedRows;

    private int failedRows;

    private List<CsvRowError> errors;

}