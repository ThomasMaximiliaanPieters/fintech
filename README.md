# fintech

This is a project by Martijn George Pieters and Thomas Maximiliaan Pieters.
This project is a data visualization app.

TailwindCSS - Documentation
https://tailwindcss.com/docs/

The project design files can be found here:
https://www.figma.com/design/nqSJcbF4mrEBx3m45zpDWt/fintech?node-id=0-1&t=U7QF1SftrDCbEThb-1

Om de site te openen moet je even een trucje uithalen:

Ten eerste moet je Node installeren. Je kan de link naar de download vinden via de volgende link:
https://nodejs.org/en

Ook heb je Git nodig. Deze kan je vinden op:
https://git-scm.com/downloads

Wanneer je deze hebt geïnstalleerd moet je een terminal openen via het tabje in de bovenbalk:
 -- Terminal > New Terminal

 Hij opent normaal gesproken een shell terminal. Aan de rechterkant van de bovenbalk zie je dat staan, samen met een + en een pijltje naar beneden. Druk op het pijltje naar beneden en selecteer Bash.

 Als je in de FINTECH folder zit in VSC moet je even verplaatsen naar de fintech folder, dit kan je doen door in de bash terminal de volgende command te plaatsen:

```

> cd fintech-1/

```

 ps. als je cd typt en dan op tab drukt vult hij het automatisch aan.


Om de Development Server te starten:

 ```

> npx next dev

```

Om de server te starten voor een productie build, plaats je de volgende command in de bash terminal:

```

> npx next build
> npx next start

```

Als je de server wil stoppen druk je op --ctrl+c-- nadat je in de terminal hebt geklikt.
## Database Setup

1. Copy `.env.example` to `.env` and update `DATABASE_URL` with your Postgres connection string.
2. Run migrations and seed data from the `fintech-1` directory:
   ```bash
   npx prisma migrate deploy
   node prisma/seed.js
   ```
3. The API routes rely on this data. Without a running database the app will fail to load financial entries.

