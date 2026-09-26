# RepTrack — complete overlay for your Laravel project

Unzip this **directly into your existing `RepTrack` Laravel project root**,
overwriting when prompted. It contains everything from both earlier zips,
merged into one drop.

I still can't ship a full standalone Laravel project (my sandbox can't reach
packagist.org to run Composer and produce `vendor/`), so this assumes the
Laravel skeleton you already have working — `artisan`, `composer.json`,
`bootstrap/`, `vendor/` — stays as-is. Only the files below are added/replaced.

## What's in here

```
app/Models/                          Program, Exercise, ProgramExercise, WorkoutLog, User
app/Http/Controllers/Controller.php  base controller (Laravel default)
app/Http/Controllers/Api/            Auth, Program, Workout, CustomWorkout, Progress
app/Providers/AppServiceProvider.php Laravel default
routes/api.php                       all /api/* endpoints
routes/web.php                       catch-all → serves the React app
config/cors.php
database/migrations/                 programs, exercises, program_exercises, workout_logs
database/seeders/DatabaseSeeder.php  demo user + Push/Pull/Legs starter data
resources/js/                        the whole React app (App.tsx, pages/, components/, context/, services/, types/)
resources/css/app.css
resources/views/app.blade.php
vite.config.ts, package.json, tailwind.config.js, postcss.config.js,
tsconfig*.json, eslint.config.js
```

## First-time setup (once)

```powershell
composer install          # only if vendor/ isn't already there
npm install
```

Set your DB connection in `.env` (SQLite is fastest to get running):

```
DB_CONNECTION=sqlite
```

then create the file: `New-Item database\database.sqlite`. Or point
`DB_HOST`/`DB_DATABASE`/`DB_USERNAME`/`DB_PASSWORD` at MySQL/Postgres instead.

Make sure `.env` also has an app key and Sanctum's default guard is fine
out of the box:

```powershell
php artisan key:generate
php artisan migrate --seed
```

`--seed` creates a demo login: `demo@reptrack.test` / `password`, plus
seeded Push/Pull/Legs programs so the app isn't empty on first load.

## Every time you work on it

Two terminals, from the project root:

```powershell
php artisan serve
npm run dev
```

Visit `http://localhost:8000`.

## If something looks stale

Browsers cache aggressively during Vite dev work. If you see errors
referencing chunks/files that don't match what's in this zip, hard-refresh
(`Ctrl+Shift+R`) or open an incognito window before assuming the code is
wrong.

## API reference

| Method | Path | Auth | Response |
|---|---|---|---|
| POST | `/api/auth/login` | – | `{token, user:{user_id,email,name}}` |
| GET | `/api/programs` | ✓ | `[{program_id, program_name}]` |
| GET | `/api/exercises?programId=` | ✓ | `[{exercise_id, exercise_name, program_id}]` |
| POST | `/api/workouts/batch` | ✓ | `{workouts:[{exerciseId,sets,reps,weight}]}` |
| GET | `/api/workouts/me` | ✓ | `[{workout_id,user_id,exercise_id,sets,reps,weight,date}]` |
| GET | `/api/workouts/stats` | ✓ | `{last_workout, total_workouts}` |
| POST | `/api/custom-workouts` | ✓ | `{name, exerciseIds:[]}` |
| GET | `/api/custom-workouts/me` | ✓ | `[{program_id, program_name, exercise_count}]` |
| GET | `/api/custom-workouts/{id}` | ✓ | `{program_id, name, user_id, exercise_ids:[]}` |
| DELETE | `/api/custom-workouts/{id}` | ✓ | `{message}` |
| GET | `/api/progress` | ✓ | `[{program_name, exercises:[{exercise_name,weight,reps}]}]` |

Auth is a bearer token (Laravel Sanctum), same-origin now — no CORS config
needed for normal use since Laravel serves both the page and the API.
