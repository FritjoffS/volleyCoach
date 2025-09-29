// database.js
import { db } from './firebase-config.js?v=1.1.0';
import { ref, get, set, push, update, remove } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// Ladda alla lag
export async function listTeams() {
  const snapshot = await get(ref(db, 'teams'));
  return snapshot.exists() ? snapshot.val() : {};
}

// Skapa nytt lag
export async function createTeam(name, type, mode) {
  const teamRef = push(ref(db, 'teams'));
  await set(teamRef, { name, type, mode, players: null, activities: null });
  return teamRef.key;
}

// Läs ett lag
export async function getTeam(teamId) {
  const snapshot = await get(ref(db, `teams/${teamId}`));
  return snapshot.exists() ? snapshot.val() : null;
}

// Lägg till spelare till lag
export async function addPlayer(teamId, playerObj) {
  const pRef = push(ref(db, `teams/${teamId}/players`));
  await set(pRef, playerObj);
  return pRef.key;
}

// Lägg till aktivitet
export async function addActivity(teamId, type, data) {
  const aRef = push(ref(db, `teams/${teamId}/activities/${type}`));
  await set(aRef, data);
  return aRef.key;
}

// Uppdatera lag
export async function updateTeam(teamId, teamData) {
  await update(ref(db, `teams/${teamId}`), teamData);
}

// Ta bort lag
export async function deleteTeam(teamId) {
  await remove(ref(db, `teams/${teamId}`));
}

// Uppdatera spelare
export async function updatePlayer(teamId, playerId, playerData) {
  await update(ref(db, `teams/${teamId}/players/${playerId}`), playerData);
}

// Ta bort spelare
export async function deletePlayer(teamId, playerId) {
  await remove(ref(db, `teams/${teamId}/players/${playerId}`));
}

// Lägg till träning
export async function addTraining(teamId, trainingData) {
  const trainingRef = push(ref(db, `teams/${teamId}/activities/trainings`));
  await set(trainingRef, trainingData);
  return trainingRef.key;
}

// Lägg till match
export async function addMatch(teamId, matchData) {
  const matchRef = push(ref(db, `teams/${teamId}/activities/matches`));
  await set(matchRef, matchData);
  return matchRef.key;
}

// Hämta aktiviteter för ett lag
export async function getActivities(teamId) {
  const snapshot = await get(ref(db, `teams/${teamId}/activities`));
  return snapshot.exists() ? snapshot.val() : { trainings: {}, matches: {} };
}

// Uppdatera träning
export async function updateTraining(teamId, trainingId, trainingData) {
  await update(ref(db, `teams/${teamId}/activities/trainings/${trainingId}`), trainingData);
}

// Uppdatera match
export async function updateMatch(teamId, matchId, matchData) {
  await update(ref(db, `teams/${teamId}/activities/matches/${matchId}`), matchData);
}

// Uppdatera matchens spelartrupp
export async function updateMatchSquad(teamId, matchId, squadData) {
  await update(ref(db, `teams/${teamId}/activities/matches/${matchId}/squad`), squadData);
}

// Hämta en specifik match
export async function getMatch(teamId, matchId) {
  const snapshot = await get(ref(db, `teams/${teamId}/activities/matches/${matchId}`));
  return snapshot.exists() ? snapshot.val() : null;
}

// Spara laguppställning för ett specifikt set
export async function saveSetLineup(teamId, matchId, setNumber, lineupData) {
  await set(ref(db, `teams/${teamId}/activities/matches/${matchId}/lineups/set${setNumber}`), lineupData);
}

// Hämta alla laguppställningar för en match
export async function getMatchLineups(teamId, matchId) {
  const snapshot = await get(ref(db, `teams/${teamId}/activities/matches/${matchId}/lineups`));
  return snapshot.exists() ? snapshot.val() : {};
}

// Ta bort laguppställning för ett set
export async function deleteSetLineup(teamId, matchId, setNumber) {
  await remove(ref(db, `teams/${teamId}/activities/matches/${matchId}/lineups/set${setNumber}`));
}

// Ta bort träning
export async function deleteTraining(teamId, trainingId) {
  await remove(ref(db, `teams/${teamId}/activities/trainings/${trainingId}`));
}

// Ta bort match
export async function deleteMatch(teamId, matchId) {
  await remove(ref(db, `teams/${teamId}/activities/matches/${matchId}`));
}
