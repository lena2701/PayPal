PayPal 
DHBW Portfolio – Verteilte Systeme 

PayPal ist ein weltweit genutzter Zahlungsdienst, der es Nutzern ermöglicht, schnell und sicher Geld digital zu senden und zu empfangen. 
Dabei fungiert PayPal als Vermittler zwischen Sender und Empfänger und übernimmt Aufgaben wie Währungsumrechnung, Gebührenabrechnung und Transaktionssicherheit.

Das Projekt demonstriert eine verteilte Architektur mit klar getrennten Schichten: 
-	Frontend 
-	Backend 
-	Datenbank 
Hierbei wird ein vollständiger Zahlungsprozess von der Auswahl des Empfängers bis zum Ende einer Transaktion mit Bestätigungs- oder Fehlermeldung abgebildet. 

## Inhalt 
1. [Funktionalität](#funktionalitat)
2. [Designentscheidungen und Technologien](#designentscheidungen-und-technologien)
3. [Architektur](#architektur)
4. [Sicherheit](#sicherheit)
5. [Datenbank](#datenbank)
6. [Abweichung zum ACD](#abweichung-zum-acd)
7. [Weiterentwicklung](#weiterentwicklung)


## Funktionalität 
Die Anwendung bildet einen vereinfachten Zahlungsprozess nach dem Vorbild von PayPal ab und ermöglicht die Durchführung von Geldtransaktionen zwischen Nutzern. 
Nach dem auswählen des Empfängers wird man auf die Betrag Seite weitergeleitet. 
Hier kann der gewünschte Betrag ausgewählt werden. Bei Bedarf kann eine abweichende, als im Konto des Senders hinterlegte, Währung ausgewählt werden. In diesem Fall wird der Wechselkurs angezeigt und die Währung automatisch umgerechnet. 
Nach dem Senden des Betrags erfolgt eine Weiterleitung auf die Ergebnisseite. Zwei mögliche Ergebnisse werden angezeigt: 
-	Transaktion erfolgreich: Bestätigungsmeldung mit dem gesendeten Betrag, dem empfangenen Betrag und der Gebühr 
-	Transaktion fehlgeschlagen: Fehlermeldung mit dem Grund für den Fehlschlag (z.B. nicht genügend Guthaben vorhanden) 

Weitere Features: 
-	Der Betrag wird automatisch in die Währung des Empfängers umgerechnet 
-	Wechselkurse werden alle 12 Stunden automatisch über die öffentliche API frankfurter.app abgerufen und in der Datenbank aktualisiert
-	Bei einer Währungsumrechnung wird automatisch eine Gebühr von 3% berechnet 
-	Alle Transaktionen werden in der Datenbank protokolliert und zusätzlich durch eine doppelte Buchführung im Transaktions-Ledger abgesichert.

## Designentscheidungen und Technologien 
**Backend**
-	Das Backend wurde mit Spring Boot und Java umgesetzt 
-	Spring Boot ermöglicht eine klare Schichtenarchitektur sowie eine einfache Umsetzung von REST Schnittstellen 

**Datenhaltung**
-	Als Datenbank wurde MySQL eingesetzt 
-	Die relationale Struktur eignet sich besonders für transaktionsbasierte Anwendungen, da die Datenkonsistenz und ACID Eigenschaften gewährleistet

**Frontend**
-	Das Frontend wurde mit HTML, CSS und JavaScript umgesetzt 
-	Zusätzlich wird Bootstrap als CSS-Framework eingesetzt 
-	Bootstrap ermöglicht eine konsistente Gestaltung sowie eine schnelle Umsetzung von UI-Komponenten wie Buttons 

**Integration und Kommunikation**
-	Die Kommunikation zwischen Frontend und Backend erfolgt über RESTful APIs 
-	Standardisierte HTTP-Methoden werden verwendet um Daten abzurufen und Transaktionen auszulösen 


## Architektur 

**Frontend**
Aufgaben des Frontends:
-	Auswahl des Empfängers 
-	Eingabe von Betrag und optionale Nachricht 
-	Auswahl der Zielwährung 
-	Anzeige von Wechselkursen und umgerechneten Beträgen 
-	Darstellung der Transaktionsergebnisse (Erfolg/Fehler) 
Die Kommunikation mit dem Backend erfolgt ausschließlich über REST-Schnittstellen (JSON)

**Backend**
Das Backend bildet die komplette Geschäftslogik ab. 
Die Backend-Architektur ist in folgende Schichten unterteilt: 
Controller Schicht: 
-	Stellt REST-Endpunkte bereit
-	Nimmt Requests vom Frontend entgegen 
-	Gibt strukturierte DTOs als Antwort zurück 

Service Schicht: 
-	Enthält die zentrale Business-Logik 
-	Validiert Eingaben 
-	Steuert Transaktionen 
-	Berechnet Gebühren 
-	Koordiniert Wechselkurse
-	Ruft die Stored Procedure auf 

Repository Schicht: 
-	Zugriff auf die Datenbank über Spring Data JPA 
-	Kapselt alle Datenbankoperationen 

Data Transfer Objects (DTO)
-	Dienen zur sauberen Trennung zwischen API und internen Modellen 
-	Verhindern das direkte Exponieren von Datenbank Entities
-	Optimieren und kontrollieren die übertragenen Daten 

**Datenbank**
Kritische Geschäftslogik wie Geldbewegung, Gebührenberechnung und Konsistenz wird über Stored Procedures umgesetzt.


## Sicherheit 
Die Anwendung berücksichtigt mehrere Sicherheitsaspekte auf Frontend-, Backend- und Datenbankebene, um fehlerhafte Eingaben, Inkonsistenzen und Manipulation zu vermeiden. 

**Datensicherheit**
Das tatsächliche Guthaben eines Nutzers wird nicht ausschließlich aus einem einzelnen Kontostand gelesen, sondern ergibt sich logisch aus den Ledger-Einträgen (doppelte Buchführung). 
Der im Account gespeicherte Kontostand dient lediglich als Cache, um Abfragen performant zu halten. 
Dadurch wird: 
-	Finanzielle Konsistenz sichergestellt 
-	Die Nachvollziehbarkeit aller Geldflüsse gewährleistet

**Transaktionssicherheit**
Kritische Zahlungslogik wird in Stored Procedures in der Datenbank ausgeführt. Diese laufen innerhalb einer atomaren Datenbanktransaktion, sodass: 
-	Alle Schritte vollständig ausgeführt werden 
-	Bei Fehlern ein Rollback erfolgt 
So wird verhindert, dass unvollständige oder inkonsistente Transaktionen entstehen

**Validierung im Backend**
Die Anwendung nutzt eine mehrstufige Backend-Validierung.
Während das Spring-Backend grundlegende Eingabeprüfungen übernimmt, wird die vollständige Geschäftslogik inklusive Nutzer-, Konto-, Guthaben- und Wechselkursprüfung in einer atomaren Stored Procedure innerhalb der Datenbank umgesetzt.

**Eingabevalidierung im Frontend**
Bereits im Frontend werden fehlerhafte oder unerwünschte Eingaben eingeschränkt_ 
-	In der Betragseingabe sind nur numerische Werte erlaubt 
-	Der Betrag wird formatiert und validiert bevor er gesendet wird 
-	Nachrichten sind zeichenbegrenzt, um Missbrauch oder überlange Eingabe zu verhindern 

## Datenbank 
Folgendes ERM – Diagramm zeigt alle Tabellen und Beziehung. 
 
Fremdschlüsselbeziehungen sind im EER-Diagramm auf Tabellenebene dargestellt.
Die konkrete Zuordnung der Schlüssel erfolgt über die definierten Foreign-Key-Constraints in der Datenbank.

**Erläuterung einzelner Tabellen:**
**Users:** Repräsentiert die Personen 
**Accounts:** Repräsentiert ein Geldkonto einer Person 
Users und Account wurden bewusst getrennt da so eine flexible Abbildung von Mehrwährungskonten ermöglicht wird. 
**Currencies:** Dient als zentrale Referenz für alle unterstützen Währungen 
**Exchange rates:** Speichert die aktuellen Wechselkurse 
**Transaction Ledger:** Enthält alle buchhalterischen Einträge einer Transaktion nach dem Prinzip der doppelten Buchführung 
**Transaction Logs:** Protokolliert technische und fachliche Ergebnisse zu Transaktionen
**Transactions:** Speichert zentrale Transaktionsinformationen

## Abweichung zum ACD
Im Rahmen der Implementierung der Anwendung kam es zu einigen bewussten Abweichungen vom ursprünglich definierten Architecture Concept Document. 
Das ACD beschreibt eine skalierbare, cloud basierte Infrastruktur mit: 
-	Einer serviceorientierten Backend Infrastruktur 
-	Klar getrennten Verantwortlichkeiten zwischen Frontend, Backend und Datenhaltung 
-	Einer relationalen Datenbank mit hoher Transaktionssicherheit 
-	Automatische Skalierung und Bereitstellung einer Cloud Umgebung 
-	Umfassende Sicherheitsmechanismen für Zahlungsprozesse

**Abweichungen:**
1.	Monlith statt Microservices: Alle relevanten Funktionen laufen auf einem Spring Boot Backend. 
2.	Frontend Framework Bootstrap anstatt React.js: Das Projekt fokussiert sich auf die Backend- und Datenbanklogik einer Zahlungsplattform. Ein klassisches Web-Frontend reicht aus Benutzerflüsse darzustellen.
3.	Vereinfachte Infrastruktur ohne Cloud Orchestrierung: Der Prototyp wird lokal betrieben, ohne Kubernetes, es erfolgt keine Orchestrierung, automatische Skalierung oder Containerverwaltung. 
4.	Vereinfachte Performance Strategie: Keine Verwendung von In-Memory-Caching Systemen wie Redis und keine asynchronen Message Queues wie Kafka. Die Verarbeitung erfolgt über REST-Schnittstellen und direkte Datenbankzugriffe.
Diese Abweichungen ergeben sich hauptsächlich aus dem begrenzten Projektumfang, zeitlichen Rahmenbedingungen sowie der Fokussierung auf einen funktionsfähigen Prototyp.

##Weiterentwicklung 
Erweiterungen und nächste Schritte:
-	Nutzung einer Orchestrierungsplattform wie Kubernetes für automatisiertes Deployment und Skalierung 
-	Integration eines Caching Systems wie Redis zur Verbesserung der Performance und Reduktion von Datenbankzugriffen 
-	Einführung mehrerer Konten pro Benutzer und weiterer Währungen zur funktionalen Erweiterung der Plattform 
