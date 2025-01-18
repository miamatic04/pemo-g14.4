package com.example.backend.service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Date;

@Service
public class GoogleCalendarService {

  /*  private static final String APPLICATION_NAME = "Your Application Name";
    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    public Calendar getCalendarService(Credential credential) throws GeneralSecurityException, IOException {
        return new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                credential
        ).setApplicationName(APPLICATION_NAME).build();
    }

    public void addEventToCalendar(Calendar calendarService) throws IOException {
        Event event = new Event()
                .setSummary("Meeting with Bob")
                .setLocation("123 Main St, Anytown, USA")
                .setDescription("Discuss the project progress.");

        Date startDate = new Date(); // Use your preferred date and time here
        Date endDate = new Date(startDate.getTime() + 3600000); // 1 hour later

        EventDateTime start = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(startDate))
                .setTimeZone("America/Los_Angeles");
        event.setStart(start);

        EventDateTime end = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(endDate))
                .setTimeZone("America/Los_Angeles");
        event.setEnd(end);

        String calendarId = "primary"; // 'primary' refers to the user's primary calendar
        event = calendarService.events().insert(calendarId, event).execute();
        System.out.printf("Event created: %s\n", event.getHtmlLink());
    }*/
}
