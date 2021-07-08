
CREATE TABLE "CrimeRecord" (
    "State" varchar NOT NULL,
    "City" varchar NOT NULL,
    "Year" int NOT NULL,
    "Population" int NOT NULL,
    "ViolentCrime" int NOT NULL,
    "Murder" int NOT NULL,
    "Rape" int NOT NULL,
    "Robbery" int NOT NULL,
    "AggravatedAssault" int NOT NULL,
    "PropertyCrime" int NOT NULL,
    "Burglary" int NOT NULL,
    "LarcenyTheft" int NOT NULL,
    "MotorVehicleTheft" int NOT NULL,
    "Arson" int NOT NULL
);

SELECT * FROM "CrimeRecord"

ALTER TABLE "CrimeRecord"
DROP COLUMN "City";

SELECT * FROM "CrimeRecord";

SELECT "State", "Year", 
	ROUND(AVG("Population")) AS "Population", 
	ROUND(AVG("ViolentCrime")) AS "Violent Crime",
	ROUND(AVG("Murder")) AS "Murder",
	ROUND(AVG("Rape")) AS "Rape",
	ROUND(AVG("Robbery")) AS "Robbery",
	ROUND(AVG("AggravatedAssault")) AS "Aggravated Assault",
	ROUND(AVG("PropertyCrime")) AS "Property Crime",
	ROUND(AVG("Burglary")) AS "Burglary",
	ROUND(AVG("LarcenyTheft")) AS "Larceny Theft",
	ROUND(AVG("MotorVehicleTheft")) AS "Motor Vehicle Theft",
	ROUND(AVG("Arson")) AS "Arson"
FROM "CrimeRecord"
GROUP BY "State", "Year"
ORDER BY "Year", "State" ASC;