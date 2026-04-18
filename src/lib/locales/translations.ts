import * as admin from './modules/admin';
import * as badges from './modules/badges';
import * as classes from './modules/classes';
import * as common from './modules/common';
import * as dashboard from './modules/dashboard';
import * as errors from './modules/errors';
import * as lobby from './modules/lobby';
import * as planner from './modules/planner';
import * as pricing from './modules/pricing';
import * as reports from './modules/reports';
import * as schools from './modules/schools';
import * as settings from './modules/settings';
import * as simulator from './modules/simulator';
import * as skills from './modules/skills';
import * as students from './modules/students';
import * as tournaments from './modules/tournaments';
import * as support from './modules/support';
import * as chess from './modules/chess';
import * as landing from './modules/landing';
import * as roadmap from './modules/roadmap';
import * as attendance from './modules/attendance';
import * as payments from './modules/payments';

export const translations = {
    en: {
        ...admin.en,
        ...badges.en,
        ...classes.en,
        ...common.en,
        ...dashboard.en,
        ...errors.en,
        ...lobby.en,
        ...planner.en,
        ...pricing.en,
        ...reports.en,
        ...schools.en,
        ...settings.en,
        ...simulator.en,
        ...skills.en,
        ...students.en,
        ...tournaments.en,
        ...support.en,
        ...chess.en,
        ...landing.en,
        ...roadmap.en,
        ...attendance.en,
        ...payments.en,
    },
    es: {
        ...admin.es,
        ...badges.es,
        ...classes.es,
        ...common.es,
        ...dashboard.es,
        ...errors.es,
        ...lobby.es,
        ...planner.es,
        ...pricing.es,
        ...reports.es,
        ...schools.es,
        ...settings.es,
        ...simulator.es,
        ...skills.es,
        ...students.es,
        ...tournaments.es,
        ...support.es,
        ...chess.es,
        ...landing.es,
        ...roadmap.es,
        ...attendance.es,
        ...payments.es,
    }
};
