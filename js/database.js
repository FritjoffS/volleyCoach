// database.js
import { db } from './firebase-config.js?v=1.1.0';
import { ref, get, set, push, update, remove } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// Ladda alla lag
export async function listTeams() {
  try {
    const snapshot = await get(ref(db, 'teams'));
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.error('Fel vid laddning av lag:', error);
    throw new Error('Kunde inte ladda lag. Kontrollera din internetanslutning.');
  }
}

// Skapa nytt lag
export async function createTeam(name, type, mode) {
  try {
    if (!name || name.trim().length === 0) {
      throw new Error('Lagnamn får inte vara tomt');
    }
    const teamRef = push(ref(db, 'teams'));
    await set(teamRef, { name, type, mode, players: null, activities: null });
    return teamRef.key;
  } catch (error) {
    console.error('Fel vid skapande av lag:', error);
    if (error.message.includes('får inte vara tomt')) {
      throw error;
    }
    throw new Error('Kunde inte skapa lag. Försök igen.');
  }
}

// Läs ett lag
export async function getTeam(teamId) {
  try {
    if (!teamId) {
      throw new Error('Lag-ID saknas');
    }
    const snapshot = await get(ref(db, `teams/${teamId}`));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Fel vid hämtning av lag:', error);
    throw new Error('Kunde inte hämta lag.');
  }
}

// Lägg till spelare till lag
export async function addPlayer(teamId, playerObj) {
  try {
    if (!teamId) {
      throw new Error('Lag-ID saknas');
    }
    if (!playerObj.name || playerObj.name.trim().length === 0) {
      throw new Error('Spelarnamn får inte vara tomt');
    }
    const pRef = push(ref(db, `teams/${teamId}/players`));
    await set(pRef, playerObj);
    return pRef.key;
  } catch (error) {
    console.error('Fel vid tillägg av spelare:', error);
    if (error.message.includes('får inte vara tomt')) {
      throw error;
    }
    throw new Error('Kunde inte lägga till spelare.');
  }
}

// Lägg till aktivitet
export async function addActivity(teamId, type, data) {
  try {
    if (!teamId || !type) {
      throw new Error('Lag-ID eller aktivitetstyp saknas');
    }
    const aRef = push(ref(db, `teams/${teamId}/activities/${type}`));
    await set(aRef, data);
    return aRef.key;
  } catch (error) {
    console.error('Fel vid tillägg av aktivitet:', error);
    throw new Error('Kunde inte lägga till aktivitet.');
  }
}

// Uppdatera lag
export async function updateTeam(teamId, teamData) {
  try {
    if (!teamId) {
      throw new Error('Lag-ID saknas');
    }
    if (teamData.name && teamData.name.trim().length === 0) {
      throw new Error('Lagnamn får inte vara tomt');
    }
    await update(ref(db, `teams/${teamId}`), teamData);
  } catch (error) {
    console.error('Fel vid uppdatering av lag:', error);
    if (error.message.includes('får inte vara tomt')) {
      throw error;
    }
    throw new Error('Kunde inte uppdatera lag.');
  }
}

// Ta bort lag
export async function deleteTeam(teamId) {
  try {
    if (!teamId) {
      throw new Error('Lag-ID saknas');
    }
    await remove(ref(db, `teams/${teamId}`));
  } catch (error) {
    console.error('Fel vid borttagning av lag:', error);
    throw new Error('Kunde inte ta bort lag.');
  }
}

// Uppdatera spelare
export async function updatePlayer(teamId, playerId, playerData) {
  try {
    if (!teamId || !playerId) {
      throw new Error('Lag-ID eller Spelar-ID saknas');
    }
    if (playerData.name && playerData.name.trim().length === 0) {
      throw new Error('Spelarnamn får inte vara tomt');
    }
    await update(ref(db, `teams/${teamId}/players/${playerId}`), playerData);
  } catch (error) {
    console.error('Fel vid uppdatering av spelare:', error);
    if (error.message.includes('får inte vara tomt')) {
      throw error;
    }
    throw new Error('Kunde inte uppdatera spelare.');
  }
}

// Ta bort spelare
export async function deletePlayer(teamId, playerId) {
  try {
    if (!teamId || !playerId) {
      throw new Error('Lag-ID eller Spelar-ID saknas');
    }
    await remove(ref(db, `teams/${teamId}/players/${playerId}`));
  } catch (error) {
    console.error('Fel vid borttagning av spelare:', error);
    throw new Error('Kunde inte ta bort spelare.');
  }
}

// Lägg till träning
export async function addTraining(teamId, trainingData) {
  try {
    if (!teamId) {
      throw new Error('Lag-ID saknas');
    }
    if (!trainingData.date) {
      throw new Error('Datum för träning måste anges');
    }
    const trainingRef = push(ref(db, `teams/${teamId}/activities/trainings`));
    await set(trainingRef, trainingData);
    return trainingRef.key;
  } catch (error) {
    console.error('Fel vid tillägg av träning:', error);
    if (error.message.includes('måste anges')) {
      throw error;
    }
    throw new Error('Kunde inte lägga till träning.');
  }
}

// Lägg till match
export async function addMatch(teamId, matchData) {
  try {
    if (!teamId) {
      throw new Error('Lag-ID saknas');
    }
    if (!matchData.date) {
      throw new Error('Datum för match måste anges');
    }
    if (!matchData.opponent) {
      throw new Error('Motståndare måste anges');
    }
    const matchRef = push(ref(db, `teams/${teamId}/activities/matches`));
    await set(matchRef, matchData);
    return matchRef.key;
  } catch (error) {
    console.error('Fel vid tillägg av match:', error);
    if (error.message.includes('måste anges')) {
      throw error;
    }
    throw new Error('Kunde inte lägga till match.');
  }
}

// Hämta aktiviteter för ett lag
export async function getActivities(teamId) {
  try {
    if (!teamId) {
      throw new Error('Lag-ID saknas');
    }
    const snapshot = await get(ref(db, `teams/${teamId}/activities`));
    return snapshot.exists() ? snapshot.val() : { trainings: {}, matches: {} };
  } catch (error) {
    console.error('Fel vid hämtning av aktiviteter:', error);
    throw new Error('Kunde inte hämta aktiviteter.');
  }
}

// Uppdatera träning
export async function updateTraining(teamId, trainingId, trainingData) {
  try {
    if (!teamId || !trainingId) {
      throw new Error('Lag-ID eller Tränings-ID saknas');
    }
    if (trainingData.date && !trainingData.date.trim()) {
      throw new Error('Datum får inte vara tomt');
    }
    await update(ref(db, `teams/${teamId}/activities/trainings/${trainingId}`), trainingData);
  } catch (error) {
    console.error('Fel vid uppdatering av träning:', error);
    if (error.message.includes('får inte vara tomt') || error.message.includes('saknas')) {
      throw error;
    }
    throw new Error('Kunde inte uppdatera träning.');
  }
}

// Uppdatera match
export async function updateMatch(teamId, matchId, matchData) {
  try {
    if (!teamId || !matchId) {
      throw new Error('Lag-ID eller Match-ID saknas');
    }
    if (matchData.date && !matchData.date.trim()) {
      throw new Error('Datum får inte vara tomt');
    }
    if (matchData.opponent && !matchData.opponent.trim()) {
      throw new Error('Motståndare får inte vara tom');
    }
    await update(ref(db, `teams/${teamId}/activities/matches/${matchId}`), matchData);
  } catch (error) {
    console.error('Fel vid uppdatering av match:', error);
    if (error.message.includes('får inte vara tomt') || error.message.includes('saknas')) {
      throw error;
    }
    throw new Error('Kunde inte uppdatera match.');
  }
}

// Uppdatera matchens spelartrupp
export async function updateMatchSquad(teamId, matchId, squadData) {
  try {
    if (!teamId || !matchId) {
      throw new Error('Lag-ID eller Match-ID saknas');
    }
    // Use set to overwrite the squad node entirely so removed players are deleted
    // (update would merge and leave removed keys intact).
    await set(ref(db, `teams/${teamId}/activities/matches/${matchId}/squad`), squadData);
  } catch (error) {
    console.error('Fel vid uppdatering av matchtrupp:', error);
    throw new Error('Kunde inte uppdatera matchtrupp.');
  }
}

// Hämta en specifik match
export async function getMatch(teamId, matchId) {
  try {
    if (!teamId || !matchId) {
      throw new Error('Lag-ID eller Match-ID saknas');
    }
    const snapshot = await get(ref(db, `teams/${teamId}/activities/matches/${matchId}`));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Fel vid hämtning av match:', error);
    throw new Error('Kunde inte hämta match.');
  }
}

// Spara laguppställning för ett specifikt set
export async function saveSetLineup(teamId, matchId, setNumber, lineupData) {
  try {
    if (!teamId || !matchId || !setNumber) {
      throw new Error('Lag-ID, Match-ID eller Set-nummer saknas');
    }
    await set(ref(db, `teams/${teamId}/activities/matches/${matchId}/lineups/set${setNumber}`), lineupData);
  } catch (error) {
    console.error('Fel vid sparande av lineup:', error);
    throw new Error('Kunde inte spara laguppställning.');
  }
}

// Hämta alla laguppställningar för en match
export async function getMatchLineups(teamId, matchId) {
  try {
    if (!teamId || !matchId) {
      throw new Error('Lag-ID eller Match-ID saknas');
    }
    const snapshot = await get(ref(db, `teams/${teamId}/activities/matches/${matchId}/lineups`));
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.error('Fel vid hämtning av lineups:', error);
    throw new Error('Kunde inte hämta laguppställningar.');
  }
}

// Ta bort laguppställning för ett set
export async function deleteSetLineup(teamId, matchId, setNumber) {
  try {
    if (!teamId || !matchId || !setNumber) {
      throw new Error('Lag-ID, Match-ID eller Set-nummer saknas');
    }
    await remove(ref(db, `teams/${teamId}/activities/matches/${matchId}/lineups/set${setNumber}`));
  } catch (error) {
    console.error('Fel vid borttagning av lineup:', error);
    throw new Error('Kunde inte ta bort laguppställning.');
  }
}

// Ta bort träning
export async function deleteTraining(teamId, trainingId) {
  try {
    if (!teamId || !trainingId) {
      throw new Error('Lag-ID eller Tränings-ID saknas');
    }
    await remove(ref(db, `teams/${teamId}/activities/trainings/${trainingId}`));
  } catch (error) {
    console.error('Fel vid borttagning av träning:', error);
    throw new Error('Kunde inte ta bort träning.');
  }
}

// Ta bort match
export async function deleteMatch(teamId, matchId) {
  try {
    if (!teamId || !matchId) {
      throw new Error('Lag-ID eller Match-ID saknas');
    }
    await remove(ref(db, `teams/${teamId}/activities/matches/${matchId}`));
  } catch (error) {
    console.error('Fel vid borttagning av match:', error);
    throw new Error('Kunde inte ta bort match.');
  }
}
