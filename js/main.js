// main.js
import { 
  renderStart, renderNewTeam, renderTeam, renderActivities, renderPlayers, 
  renderPlayerForm, renderPlayer, renderEditTeam, renderTrainingForm, 
  renderMatchForm, renderTrainingDetail, renderMatchDetail, renderSquadManager,
  renderLineupManager, showLoading, showError 
} from './ui.js?v=1.1.0';
import { 
  listTeams, createTeam, getTeam, addPlayer, updateTeam, deleteTeam, 
  updatePlayer, deletePlayer, addTraining, addMatch, getActivities,
  updateTraining, updateMatch, deleteTraining, deleteMatch, updateMatchSquad, getMatch,
  saveSetLineup, getMatchLineups, deleteSetLineup
} from './database.js?v=1.1.0';

// Globalt sparat state
let currentTeamId = null;
let currentPlayerId = null;
let currentTrainingId = null;
let currentMatchId = null;

// Visa startsida med alla lag
function showStart() {
  showLoading(document.getElementById('app'), "Laddar lag...");
  listTeams()
    .then(teams => {
      renderStart(document.getElementById('app'), teams, showTeam, showNewTeam);
    })
    .catch(error => {
      console.error('Fel vid laddning av lag:', error);
      showError(document.getElementById('app'), 'Kunde inte ladda lag. Kontrollera din internetanslutning.', showStart);
    });
}

// Visa formulär att skapa nytt lag
function showNewTeam() {
  renderNewTeam(document.getElementById('app'), async (teamData) => {
    const teamId = await createTeam(teamData.name, teamData.type, teamData.mode);
    currentTeamId = teamId;
    showTeam(teamId);
  }, showStart);
}

// Visa lagets sida med meny
function showTeam(teamId) {
  currentTeamId = teamId;
  getTeam(teamId).then(team => {
    renderTeam(document.getElementById('app'), team, showActivities, showPlayers, showEditTeam, showStart);
  });
}

// Visa redigera lag
function showEditTeam() {
  getTeam(currentTeamId).then(team => {
    renderEditTeam(
      document.getElementById('app'), 
      team,
      async (teamData) => {
        try {
          showLoading(document.getElementById('app'), "Sparar ändringar...");
          await updateTeam(currentTeamId, teamData);
          showTeam(currentTeamId);
        } catch (error) {
          console.error('Fel vid uppdatering av lag:', error);
          showError(document.getElementById('app'), 'Kunde inte spara ändringar.', () => showEditTeam());
        }
      },
      () => showTeam(currentTeamId),
      async () => {
        try {
          showLoading(document.getElementById('app'), "Tar bort lag...");
          await deleteTeam(currentTeamId);
          showStart();
        } catch (error) {
          console.error('Fel vid borttagning av lag:', error);
          showError(document.getElementById('app'), 'Kunde inte ta bort lag.', () => showEditTeam());
        }
      }
    );
  });
}

// Visa lista över aktiviteter (träningar och matcher)
function showActivities() {
  showLoading(document.getElementById('teamContent'), "Laddar aktiviteter...");
  getActivities(currentTeamId)
    .then(activities => {
      renderActivities(
        document.getElementById('teamContent'), 
        activities, 
        showNewTraining, 
        showNewMatch, 
        showTraining, 
        showMatch,
        () => showTeam(currentTeamId) // Tillbaka till lag
      );
    })
    .catch(error => {
      console.error('Fel vid laddning av aktiviteter:', error);
      showError(document.getElementById('teamContent'), 'Kunde inte ladda aktiviteter.', showActivities);
    });
}

// Visa lista med spelare
function showPlayers() {
  getTeam(currentTeamId).then(team => {
    const players = team.players || {};
    renderPlayers(
      document.getElementById('teamContent'), 
      players, 
      showNewPlayer, 
      showPlayer,
      () => showTeam(currentTeamId) // Tillbaka till lag
    );
  });
}

// Visa detaljer och info för en spelare
function showPlayer(playerId) {
  currentPlayerId = playerId;
  getTeam(currentTeamId).then(team => {
    const player = team.players ? team.players[playerId] : null;
    if (!player) {
      alert('Spelare finns ej!');
      return;
    }
    renderPlayer(document.getElementById('teamContent'), player, showEditPlayer, showPlayers);
  });
}

// Visa formulär för ny spelare
function showNewPlayer() {
  renderPlayerForm(document.getElementById('teamContent'), null, async (playerData) => {
    await addPlayer(currentTeamId, playerData);
    showPlayers();
  }, showPlayers);
}

// Visa formulär för att redigera spelare
function showEditPlayer() {
  getTeam(currentTeamId).then(team => {
    const player = team.players[currentPlayerId];
    renderPlayerForm(
      document.getElementById('teamContent'), 
      player, 
      async (playerData) => {
        try {
          showLoading(document.getElementById('teamContent'), "Sparar ändringar...");
          await updatePlayer(currentTeamId, currentPlayerId, playerData);
          showPlayer(currentPlayerId);
        } catch (error) {
          console.error('Fel vid uppdatering av spelare:', error);
          showError(document.getElementById('teamContent'), 'Kunde inte spara ändringar.', () => showEditPlayer());
        }
      }, 
      () => showPlayer(currentPlayerId),
      async () => {
        try {
          showLoading(document.getElementById('teamContent'), "Tar bort spelare...");
          await deletePlayer(currentTeamId, currentPlayerId);
          showPlayers();
        } catch (error) {
          console.error('Fel vid borttagning av spelare:', error);
          showError(document.getElementById('teamContent'), 'Kunde inte ta bort spelare.', () => showEditPlayer());
        }
      }
    );
  });
}

// Visa formulär för ny träning
function showNewTraining() {
  renderTrainingForm(
    document.getElementById('teamContent'), 
    null, 
    async (trainingData) => {
      try {
        showLoading(document.getElementById('teamContent'), "Skapar träning...");
        await addTraining(currentTeamId, trainingData);
        showActivities();
      } catch (error) {
        console.error('Fel vid skapande av träning:', error);
        showError(document.getElementById('teamContent'), 'Kunde inte skapa träning.', showNewTraining);
      }
    }, 
    showActivities
  );
}

// Visa formulär för ny match
function showNewMatch() {
  renderMatchForm(
    document.getElementById('teamContent'), 
    null, 
    async (matchData) => {
      try {
        showLoading(document.getElementById('teamContent'), "Skapar match...");
        await addMatch(currentTeamId, matchData);
        showActivities();
      } catch (error) {
        console.error('Fel vid skapande av match:', error);
        showError(document.getElementById('teamContent'), 'Kunde inte skapa match.', showNewMatch);
      }
    }, 
    showActivities
  );
}

// Visa detaljer för träning
function showTraining(trainingId) {
  currentTrainingId = trainingId;
  getActivities(currentTeamId).then(activities => {
    const training = activities.trainings[trainingId];
    if (!training) {
      showError(document.getElementById('teamContent'), 'Träning hittades inte.');
      return;
    }
    renderTrainingDetail(
      document.getElementById('teamContent'), 
      training, 
      showEditTraining, 
      showActivities
    );
  });
}

// Visa detaljer för match
function showMatch(matchId) {
  currentMatchId = matchId;
  getActivities(currentTeamId).then(activities => {
    const match = activities.matches[matchId];
    if (!match) {
      showError(document.getElementById('teamContent'), 'Match hittades inte.');
      return;
    }
    renderMatchDetail(
      document.getElementById('teamContent'), 
      match, 
      showEditMatch, 
      showActivities,
      () => showSquadManager(matchId), // Hantera trupp
      () => showLineupManager(matchId) // Hantera laguppställningar
    );
  });
}

// Visa formulär för att redigera träning
function showEditTraining() {
  getActivities(currentTeamId).then(activities => {
    const training = activities.trainings[currentTrainingId];
    renderTrainingForm(
      document.getElementById('teamContent'), 
      training, 
      async (trainingData) => {
        try {
          showLoading(document.getElementById('teamContent'), "Sparar ändringar...");
          await updateTraining(currentTeamId, currentTrainingId, trainingData);
          showTraining(currentTrainingId);
        } catch (error) {
          console.error('Fel vid uppdatering av träning:', error);
          showError(document.getElementById('teamContent'), 'Kunde inte spara ändringar.', showEditTraining);
        }
      }, 
      () => showTraining(currentTrainingId),
      async () => {
        try {
          showLoading(document.getElementById('teamContent'), "Tar bort träning...");
          await deleteTraining(currentTeamId, currentTrainingId);
          showActivities();
        } catch (error) {
          console.error('Fel vid borttagning av träning:', error);
          showError(document.getElementById('teamContent'), 'Kunde inte ta bort träning.', showEditTraining);
        }
      }
    );
  });
}

// Visa formulär för att redigera match
function showEditMatch() {
  getActivities(currentTeamId).then(activities => {
    const match = activities.matches[currentMatchId];
    renderMatchForm(
      document.getElementById('teamContent'), 
      match, 
      async (matchData) => {
        try {
          showLoading(document.getElementById('teamContent'), "Sparar ändringar...");
          await updateMatch(currentTeamId, currentMatchId, matchData);
          showMatch(currentMatchId);
        } catch (error) {
          console.error('Fel vid uppdatering av match:', error);
          showError(document.getElementById('teamContent'), 'Kunde inte spara ändringar.', showEditMatch);
        }
      }, 
      () => showMatch(currentMatchId),
      async () => {
        try {
          showLoading(document.getElementById('teamContent'), "Tar bort match...");
          await deleteMatch(currentTeamId, currentMatchId);
          showActivities();
        } catch (error) {
          console.error('Fel vid borttagning av match:', error);
          showError(document.getElementById('teamContent'), 'Kunde inte ta bort match.', showEditMatch);
        }
      }
    );
  });
}

// Visa spelartrupp-hantering för match
function showSquadManager(matchId) {
  showLoading(document.getElementById('teamContent'), "Laddar spelartrupp...");
  
  Promise.all([
    getMatch(currentTeamId, matchId),
    getTeam(currentTeamId)
  ]).then(([match, team]) => {
    if (!match) {
      showError(document.getElementById('teamContent'), 'Match hittades inte.');
      return;
    }
    
    const players = team.players || {};
    renderSquadManager(
      document.getElementById('teamContent'),
      match,
      players,
      async (squadData) => {
        try {
          showLoading(document.getElementById('teamContent'), "Sparar trupp...");
          await updateMatchSquad(currentTeamId, matchId, squadData);
          showMatch(matchId); // Tillbaka till matchdetaljer
        } catch (error) {
          console.error('Fel vid sparande av trupp:', error);
          showError(document.getElementById('teamContent'), 'Kunde inte spara trupp.', () => showSquadManager(matchId));
        }
      },
      () => showMatch(matchId) // Tillbaka utan att spara
    );
  }).catch(error => {
    console.error('Fel vid laddning av spelartrupp-data:', error);
    showError(document.getElementById('teamContent'), 'Kunde inte ladda data för spelartrupp.', () => showSquadManager(matchId));
  });
}

// Visa laguppställnings-hantering för match
function showLineupManager(matchId) {
  showLoading(document.getElementById('teamContent'), "Laddar laguppställningar...");
  
  Promise.all([
    getMatch(currentTeamId, matchId),
    getMatchLineups(currentTeamId, matchId),
    getTeam(currentTeamId)
  ]).then(([match, lineups, team]) => {
    if (!match) {
      showError(document.getElementById('teamContent'), 'Match hittades inte.');
      return;
    }
    
    // Endast spelare som är i truppen kan väljas för uppställning
    const squadPlayers = match.squad || {};
    
    if (Object.keys(squadPlayers).length === 0) {
      showError(
        document.getElementById('teamContent'), 
        'Du måste först välja en spelartrupp för denna match innan du kan skapa laguppställningar.',
        () => showSquadManager(matchId)
      );
      return;
    }
    
    renderLineupManager(
      document.getElementById('teamContent'),
      match,
      lineups,
      squadPlayers,
      async (lineupsData) => {
        // Detta används bara för "Tillbaka utan att spara"
        showMatch(matchId);
      },
      () => showMatch(matchId) // Tillbaka utan att spara
    );
    
    // Setup callback för att spara individuellt set
    window.saveCurrentSetData = async (setNumber, lineupData) => {
      await saveSetLineup(currentTeamId, matchId, setNumber, lineupData);
    };
  }).catch(error => {
    console.error('Fel vid laddning av laguppställnings-data:', error);
    showError(document.getElementById('teamContent'), 'Kunde inte ladda data för laguppställningar.', () => showLineupManager(matchId));
  });
}

// Starta appen med startvyn
showStart();
