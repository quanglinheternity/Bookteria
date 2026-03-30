package com.devteria.post.service;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class TimeFormatter {

    Map<Long, Function<Instant, String>> startegyMap = new LinkedHashMap<>();
    public  TimeFormatter(){
        startegyMap.put(60L, this::formatSeconds);
        startegyMap.put(3600L, this::formatMinutes);
        startegyMap.put(86400L, this::formatHours);
        startegyMap.put(Long.MAX_VALUE, this::formatDays);
    }
    private String formatSeconds(Instant instant){
        long elapseSeconds = ChronoUnit.SECONDS.between(instant, Instant.now());
        return elapseSeconds + " seconds";
    }
    private String formatMinutes(Instant instant){
        long elapseMinutes = ChronoUnit.MINUTES.between(instant, Instant.now());
        return  elapseMinutes + " minutes";
    }
    private String formatHours(Instant instant){
        long elapseHours = ChronoUnit.HOURS.between(instant, Instant.now());
        return elapseHours + " hours";
    }
    private String formatDays(Instant instant){
        LocalDateTime localDateTime = instant
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime() ;
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ISO_DATE ;
        return localDateTime.format(dateTimeFormatter);
    }
    public String format(Instant instant){
        long elapseSeconds = ChronoUnit.SECONDS.between(instant, Instant.now());
        var startegy = startegyMap.entrySet().stream().filter(longFunctionEntry -> elapseSeconds <longFunctionEntry.getKey()).findFirst().get();
        return startegy.getValue().apply(instant);
    }
}
