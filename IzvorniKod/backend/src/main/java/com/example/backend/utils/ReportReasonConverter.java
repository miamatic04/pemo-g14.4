package com.example.backend.utils;

import com.example.backend.model.ReportReason;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.*;
import java.util.stream.Collectors;

@Converter
public class ReportReasonConverter implements AttributeConverter<List<ReportReason>, String> {

    @Override
    public String convertToDatabaseColumn(List<ReportReason> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return null;
        }
        return attribute.stream()
                .map(Enum::name)
                .collect(Collectors.joining(","));
    }

    @Override
    public List<ReportReason> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(dbData.split(","))
                .map(ReportReason::valueOf)
                .collect(Collectors.toList());
    }
}