const { Client } = require("pg");
const express = require("express");
const morgan = require("morgan"); // Some nice logging

/**
 * Følgende parametre bruges til at forbinde til databasen.
 * PORT er den port som webserveren her kører på.
 * DB_USER er brugernavnet til databasen.
 * DB_HOST er serveren som databasen kører på. Enten localhost eller en anden server.
 * DB_NAME er det navn som databasen har.
 * DB_PW er password til DB_USER.
 * DB_PORT er porten til databasen. Det plejer at være 5432, så den behøver man nok ikke ændre.
 */
const PORT = process.env.PORT || 8080;
const DB_USER = process.env.DB_USER || "ozmsopos";
const DB_HOST = process.env.DB_HOST || "mouse.db.elephantsql.com";
const DB_NAME = process.env.DB_NAME || "ozmsopos";
const DB_PW = process.env.DB_PW || "GAwddUeFxU1SC4DAeLqE-JD-7A71SpXD";
const DB_PORT = process.env.DB_PORT || 5432;

/**
 * I stedet for at ændre på DB-værdierne i koden herover, er det bedre at gøre det som
 * en del af den måde man kører programmet på. Hver DB-værdi kan sættes i terminalen
 * inden man kører programmet. Det gør man sådan her:
 * 
 * $ export DB_NAME="kristians-database"
 * 
 * Nu er DB_NAME sat til "kristians-database" når programmet kører, uden at man har
 * ændret i JavaScript-koden. Dette skal gøres hver gang du åbner en ny terminal.
 * Det skal helst gøres både for DB_NAME, DB_PW, DB_USER og DB_HOST.
 * PORT og DB_PORT plejer man ikke at ændre.
 */
if (!process.env.DB_NAME || !process.env.DB_PW || !process.env.DB_USER) {
  console.warn("Husk at sætte databasenavn, password og user via env vars.");
  console.warn("Eksempel på at sætte databasenavn i terminalen:");
  console.warn(`export DB_NAME="kristians-database"`);
  console.warn("Lige nu er databasenavn sat til:", DB_NAME);
} else {
  console.log("Postgres database:", DB_NAME);
  console.log("Postgres user:", DB_USER);
}

/*
 * Herunder laves web-serveren. Den indeholder din html (fra public-folderen)
 * og API'en så der er forbindelse videre til databasen fra JavaScript. Det er "to i en".
 */
const app = express();
const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PW,
  port: DB_PORT
});
client.connect();

app.use(express.text());
app.use(express.static("public"))
app.use(morgan("combined")); 

/*
 * Her defineres API'en.
 * Man laver lige så mange endpoints man har lyst til. Jeg har lavet et enkelt til
 * querien `SELECT 'Hello, World' as message`.
 */
app.get("/api/allfood", async (req, res) => {
  try {
    // Lav query
    const query1 = `SELECT SUBSTRING(food_name, 1,12) as shortenfood_name, food_name, co2_aftryk, emoji
    FROM food
    WHERE food_name ILIKE 'flæskesteg%' 
    OR food_name ILIKE 'Kartoffel. uspec.. rå' 
    OR food_name ILIKE 'snaps%'
    OR food_name ILIKE 'Øl, hvidtøl, letøl'
    OR food_name ILIKE 'risen%'
    OR food_name ILIKE 'Rødkål. konserves. uden tilsat sukker';`;
    const query2 = `SELECT SUBSTRING(food_name, 1,12) as shortenfood_name, food_name, co2_aftryk, emoji
    FROM food
    WHERE food_name ILIKE 'Hasselback%' 
    OR food_name ILIKE 'Kartoffel. uspec.. rå' 
    OR food_name ILIKE 'Risdrik%'
    OR food_name ILIKE 'Øl, hvidtøl, letøl'
    OR food_name ILIKE 'Rødkål. konserves. uden tilsat sukker'
    OR food_name ILIKE 'Vegansk is%';`;
    const query3 = `SELECT SUBSTRING(food_name, 1,12) as shortenfood_name, food_name, co2_aftryk, emoji
    FROM food
    WHERE food_name ILIKE 'grillpølser%' 
    OR food_name ILIKE 'paksoi%' 
    OR food_name ILIKE '%postevand%'
	  OR food_name ILIKE 'energidrik'
    OR food_name ILIKE '%æbleskiver%'
    OR food_name ILIKE 'grønkål%';`;
    const query4 = `SELECT SUBSTRING(food_name, 1,12) as shortenfood_name, food_name, co2_aftryk, emoji
    FROM food
    WHERE food_name ILIKE 'Oksekød. mørbrad. afpudset. rå' 
    OR food_name ILIKE 'and%' 
    OR food_name ILIKE 'Skinke. kogt. skiveskåret'
	  OR food_name ILIKE 'kebab'
    OR food_name ILIKE 'Kalkun. kød. rå'
    OR food_name ILIKE 'veganske filetstykker';`;
    queryData1 = await client.query(query1);
    queryData2 = await client.query(query2);
    queryData3 = await client.query(query3);
    queryData4 = await client.query(query4);
    // Giv svar tilbage til JavaScript
    res.json({
      "ok": true,
      "julefrokost": queryData1.rows,
      "veganskjulefrkost": queryData2.rows,
      "co2neutraljulefrokost": queryData3.rows,
      "hovedret": queryData4.rows,
    })
  } catch (error) {
    // Hvis query fejler, fanges det her.
    // Send fejlbesked tilbage til JavaScript
    res.json({
      "ok": false,
      "message": error.message,
    })
  }
});

app.get("/api/hello", async (req, res) => {
  res.json({ "message": "Hello, World!" });
})

// Web-serveren startes.
app.listen(PORT, () => console.log(`Serveren kører på http://localhost:${PORT}`));