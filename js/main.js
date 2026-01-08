// main.js
import { 
  renderStart, renderNewTeam, renderTeam, renderActivities, renderPlayers, 
  renderPlayerForm, renderPlayer, renderEditTeam, renderTrainingForm, 
  renderMatchForm, renderTrainingDetail, renderMatchDetail, renderSquadManager,
  renderLineupManager, showLoading, showError 
} from './ui.js?v=1.2.0';
import { 
  listTeams, createTeam, getTeam, addPlayer, updateTeam, deleteTeam, 
  updatePlayer, deletePlayer, addTraining, addMatch, getActivities,
  updateTraining, updateMatch, deleteTraining, deleteMatch, updateMatchSquad, getMatch,
  saveSetLineup, getMatchLineups, deleteSetLineup
} from './database.js?v=1.2.0';
import {
  validateTeamName, validatePlayerName, validatePlayerNumber, validateContact,
  validateDate, validateTime, validateOpponent, confirmDelete, showSuccess,
  showErrorToast, handleError
} from './utils.js?v=1.2.0';

// PWA Installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA install prompt available');
  // Förhindra Chrome 67 och tidigare från att automatiskt visa prompten
  e.preventDefault();
  // Spara eventet så vi kan trigga det senare
  deferredPrompt = e;
  // Visa vår egna install-knapp
  showInstallButton();
});

window.addEventListener('appinstalled', (e) => {
  console.log('PWA was installed successfully');
  // Rensa deferredPrompt så den inte kan användas igen
  deferredPrompt = null;
  // Ta bort install-bannern
  const installBanner = document.getElementById('installBanner');
  if (installBanner) {
    installBanner.remove();
  }
});

function showInstallButton() {
  // Skapa install-banner om den inte finns
  if (!document.getElementById('installBanner')) {
    const banner = document.createElement('div');
    banner.id = 'installBanner';
    banner.className = 'install-banner';
    banner.innerHTML = `
      <div class="install-banner-content">
        <div class="install-banner-icon">📱</div>
        <div class="install-banner-text">
          <strong>Installera VolleyCoach</strong>
          <span>Få snabb åtkomst från hemskärmen</span>
        </div>
        <button id="installButton" class="install-banner-button">
          Installera
        </button>
        <button id="dismissInstallBanner" class="install-banner-dismiss" title="Stäng">
          ✕
        </button>
      </div>
    `;
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    document.getElementById('installButton').onclick = installApp;
    document.getElementById('dismissInstallBanner').onclick = () => {
      banner.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => banner.remove(), 300);
    };
  }
}

async function installApp() {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return;
  }
  
  // Visa install prompten
  deferredPrompt.prompt();
  
  // Vänta på användarens val
  const result = await deferredPrompt.userChoice;
  console.log('Install result:', result.outcome);
  
  if (result.outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }
  
  // Ta bort install-bannern
  const installBanner = document.getElementById('installBanner');
  if (installBanner) {
    installBanner.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => installBanner.remove(), 300);
  }
  
  // Rensa deferredPrompt eftersom den bara kan användas en gång
  deferredPrompt = null;
}

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
      handleError(error, 'vid laddning av lag');
      showError(document.getElementById('app'), 'Kunde inte ladda lag. Kontrollera din internetanslutning.', showStart);
    });
}

// Expose stable global navigations so UI buttons can call them directly
window.gotoStart = showStart;

// Visa formulär att skapa nytt lag
function showNewTeam() {
  renderNewTeam(document.getElementById('app'), async (teamData) => {
    // Validera lagnamn
    const nameValidation = validateTeamName(teamData.name);
    if (!nameValidation.valid) {
      showErrorToast(nameValidation.error);
      return;
    }
    
    try {
      showLoading(document.getElementById('app'), "Skapar lag...");
      const teamId = await createTeam(teamData.name, teamData.type, teamData.mode);
      currentTeamId = teamId;
      showSuccess('Lag skapat!');
      showTeam(teamId);
    } catch (error) {
      handleError(error, 'vid skapande av lag');
    }
  }, showStart);
}

// Visa lagets sida med meny
function showTeam(teamId) {
  currentTeamId = teamId;
  showLoading(document.getElementById('app'), "Laddar lag...");
  getTeam(teamId)
    .then(team => {
      if (!team) {
        showErrorToast('Lag hittades inte');
        showStart();
        return;
      }
      renderTeam(document.getElementById('app'), team, showActivities, showPlayers, showEditTeam, showStart);
    })
    .catch(error => {
      handleError(error, 'vid laddning av lag');
      showStart();
    });
}

// Visa redigera lag
function showEditTeam() {
  showLoading(document.getElementById('app'), "Laddar laguppgifter...");
  getTeam(currentTeamId)
    .then(team => {
      renderEditTeam(
        document.getElementById('app'), 
        team,
        async (teamData) => {
          // Validera lagnamn
          const nameValidation = validateTeamName(teamData.name);
          if (!nameValidation.valid) {
            showErrorToast(nameValidation.error);
            return;
          }
          
          try {
            showLoading(document.getElementById('app'), "Sparar ändringar...");
            await updateTeam(currentTeamId, teamData);
            showSuccess('Lag uppdaterat!');
            showTeam(currentTeamId);
          } catch (error) {
            handleError(error, 'vid uppdatering av lag');
          }
        },
        () => showTeam(currentTeamId),
        async () => {
          const confirmed = await confirmDelete('laget', team.name);
          if (!confirmed) return;
          
          try {
            showLoading(document.getElementById('app'), "Tar bort lag...");
            await deleteTeam(currentTeamId);
            showSuccess('Lag borttaget');
            showStart();
          } catch (error) {
            handleError(error, 'vid borttagning av lag');
          }
        }
      );
    })
    .catch(error => {
      handleError(error, 'vid laddning av laguppgifter');
      showTeam(currentTeamId);
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
      handleError(error, 'vid laddning av aktiviteter');
      showError(document.getElementById('teamContent'), 'Kunde inte ladda aktiviteter.', showActivities);
    });
}

// Visa lista med spelare
function showPlayers() {
  showLoading(document.getElementById('teamContent'), "Laddar spelare...");
  getTeam(currentTeamId)
    .then(team => {
      const players = team.players || {};
      renderPlayers(
        document.getElementById('teamContent'), 
        players, 
        showNewPlayer, 
        showPlayer,
        () => showTeam(currentTeamId) // Tillbaka till lag
      );
    })
    .catch(error => {
      handleError(error, 'vid laddning av spelare');
      showError(document.getElementById('teamContent'), 'Kunde inte ladda spelare.', () => showTeam(currentTeamId));
    });
}

// Visa detaljer och info för en spelare
function showPlayer(playerId) {
  currentPlayerId = playerId;
  showLoading(document.getElementById('teamContent'), "Laddar spelaruppgifter...");
  getTeam(currentTeamId)
    .then(team => {
      const player = team.players ? team.players[playerId] : null;
      if (!player) {
        showErrorToast('Spelare finns ej!');
        showPlayers();
        return;
      }
      renderPlayer(document.getElementById('teamContent'), player, showEditPlayer, showPlayers);
    })
    .catch(error => {
      handleError(error, 'vid laddning av spelaruppgifter');
      showPlayers();
    });
}

// Visa formulär för ny spelare
function showNewPlayer() {
  renderPlayerForm(document.getElementById('teamContent'), null, async (playerData) => {
    // Validera spelardata
    const nameValidation = validatePlayerName(playerData.name);
    if (!nameValidation.valid) {
      showErrorToast(nameValidation.error);
      return;
    }
    
    if (playerData.number) {
      const numberValidation = validatePlayerNumber(playerData.number);
      if (!numberValidation.valid) {
        showErrorToast(numberValidation.error);
        return;
      }
    }
    
    if (playerData.contactInfo) {
      const contactValidation = validateContact(playerData.contactInfo);
      if (!contactValidation.valid) {
        showErrorToast(contactValidation.error);
        return;
      }
    }
    
    try {
      showLoading(document.getElementById('teamContent'), "Lägger till spelare...");
      await addPlayer(currentTeamId, playerData);
      showSuccess('Spelare tillagd!');
      showPlayers();
    } catch (error) {
      handleError(error, 'vid tillägg av spelare');
    }
  }, showPlayers);
}

// Visa formulär för att redigera spelare
function showEditPlayer() {
  showLoading(document.getElementById('teamContent'), "Laddar spelaruppgifter...");
  getTeam(currentTeamId)
    .then(team => {
      const player = team.players[currentPlayerId];
      renderPlayerForm(
        document.getElementById('teamContent'), 
        player, 
        async (playerData) => {
          // Validera spelardata
          const nameValidation = validatePlayerName(playerData.name);
          if (!nameValidation.valid) {
            showErrorToast(nameValidation.error);
            return;
          }
          
          if (playerData.number) {
            const numberValidation = validatePlayerNumber(playerData.number);
            if (!numberValidation.valid) {
              showErrorToast(numberValidation.error);
              return;
            }
          }
          
          if (playerData.contactInfo) {
            const contactValidation = validateContact(playerData.contactInfo);
            if (!contactValidation.valid) {
              showErrorToast(contactValidation.error);
              return;
            }
          }
          
          try {
            showLoading(document.getElementById('teamContent'), "Sparar ändringar...");
            await updatePlayer(currentTeamId, currentPlayerId, playerData);
            showSuccess('Spelare uppdaterad!');
            showPlayer(currentPlayerId);
          } catch (error) {
            handleError(error, 'vid uppdatering av spelare');
          }
        }, 
        () => showPlayer(currentPlayerId),
        async () => {
          const confirmed = await confirmDelete('spelaren', player.name);
          if (!confirmed) return;
          
          try {
            showLoading(document.getElementById('teamContent'), "Tar bort spelare...");
            await deletePlayer(currentTeamId, currentPlayerId);
            showSuccess('Spelare borttagen');
            showPlayers();
          } catch (error) {
            handleError(error, 'vid borttagning av spelare');
          }
        }
      );
    })
    .catch(error => {
      handleError(error, 'vid laddning av spelaruppgifter');
      showPlayers();
    });
}

// Visa formulär för ny träning
function showNewTraining() {
  renderTrainingForm(
    document.getElementById('teamContent'), 
    null, 
    async (trainingData) => {
      // Validera träningsdata
      const dateValidation = validateDate(trainingData.date);
      if (!dateValidation.valid) {
        showErrorToast(dateValidation.error);
        return;
      }
      
      if (trainingData.time) {
        const timeValidation = validateTime(trainingData.time);
        if (!timeValidation.valid) {
          showErrorToast(timeValidation.error);
          return;
        }
      }
      
      try {
        showLoading(document.getElementById('teamContent'), "Skapar träning...");
        await addTraining(currentTeamId, trainingData);
        showSuccess('Träning skapad!');
        showActivities();
      } catch (error) {
        handleError(error, 'vid skapande av träning');
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
      // Validera matchdata
      const dateValidation = validateDate(matchData.date);
      if (!dateValidation.valid) {
        showErrorToast(dateValidation.error);
        return;
      }
      
      if (matchData.time) {
        const timeValidation = validateTime(matchData.time);
        if (!timeValidation.valid) {
          showErrorToast(timeValidation.error);
          return;
        }
      }
      
      const opponentValidation = validateOpponent(matchData.opponent);
      if (!opponentValidation.valid) {
        showErrorToast(opponentValidation.error);
        return;
      }
      
      try {
        showLoading(document.getElementById('teamContent'), "Skapar match...");
        await addMatch(currentTeamId, matchData);
        showSuccess('Match skapad!');
        showActivities();
      } catch (error) {
        handleError(error, 'vid skapande av match');
      }
    }, 
    showActivities
  );
}

// Visa detaljer för träning
function showTraining(trainingId) {
  currentTrainingId = trainingId;
  showLoading(document.getElementById('teamContent'), "Laddar träning...");
  getActivities(currentTeamId)
    .then(activities => {
      const training = activities.trainings[trainingId];
      if (!training) {
        showErrorToast('Träning hittades inte');
        showActivities();
        return;
      }
      renderTrainingDetail(
        document.getElementById('teamContent'), 
        training, 
        showEditTraining, 
        showActivities
      );
    })
    .catch(error => {
      handleError(error, 'vid laddning av träning');
      showActivities();
    });
}

// Visa detaljer för match
function showMatch(matchId) {
  currentMatchId = matchId;
  showLoading(document.getElementById('teamContent'), "Laddar match...");
  getActivities(currentTeamId)
    .then(activities => {
      const match = activities.matches[matchId];
      if (!match) {
        showErrorToast('Match hittades inte');
        showActivities();
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
    })
    .catch(error => {
      handleError(error, 'vid laddning av match');
      showActivities();
    });
}

// Visa formulär för att redigera träning
function showEditTraining() {
  showLoading(document.getElementById('teamContent'), "Laddar träningsuppgifter...");
  getActivities(currentTeamId)
    .then(activities => {
      const training = activities.trainings[currentTrainingId];
      renderTrainingForm(
        document.getElementById('teamContent'), 
        training, 
        async (trainingData) => {
          // Validera träningsdata
          const dateValidation = validateDate(trainingData.date);
          if (!dateValidation.valid) {
            showErrorToast(dateValidation.error);
            return;
          }
          
          if (trainingData.time) {
            const timeValidation = validateTime(trainingData.time);
            if (!timeValidation.valid) {
              showErrorToast(timeValidation.error);
              return;
            }
          }
          
          try {
            showLoading(document.getElementById('teamContent'), "Sparar ändringar...");
            await updateTraining(currentTeamId, currentTrainingId, trainingData);
            showSuccess('Träning uppdaterad!');
            showTraining(currentTrainingId);
          } catch (error) {
            handleError(error, 'vid uppdatering av träning');
          }
        }, 
        () => showTraining(currentTrainingId),
        async () => {
          const confirmed = await confirmDelete('träningen', training.date || 'denna träning');
          if (!confirmed) return;
          
          try {
            showLoading(document.getElementById('teamContent'), "Tar bort träning...");
            await deleteTraining(currentTeamId, currentTrainingId);
            showSuccess('Träning borttagen');
            showActivities();
          } catch (error) {
            handleError(error, 'vid borttagning av träning');
          }
        }
      );
    })
    .catch(error => {
      handleError(error, 'vid laddning av träningsuppgifter');
      showActivities();
    });
}

// Visa formulär för att redigera match
function showEditMatch() {
  showLoading(document.getElementById('teamContent'), "Laddar matchuppgifter...");
  getActivities(currentTeamId)
    .then(activities => {
      const match = activities.matches[currentMatchId];
      renderMatchForm(
        document.getElementById('teamContent'), 
        match, 
        async (matchData) => {
          // Validera matchdata
          const dateValidation = validateDate(matchData.date);
          if (!dateValidation.valid) {
            showErrorToast(dateValidation.error);
            return;
          }
          
          if (matchData.time) {
            const timeValidation = validateTime(matchData.time);
            if (!timeValidation.valid) {
              showErrorToast(timeValidation.error);
              return;
            }
          }
          
          const opponentValidation = validateOpponent(matchData.opponent);
          if (!opponentValidation.valid) {
            showErrorToast(opponentValidation.error);
            return;
          }
          
          try {
            showLoading(document.getElementById('teamContent'), "Sparar ändringar...");
            await updateMatch(currentTeamId, currentMatchId, matchData);
            showSuccess('Match uppdaterad!');
            showMatch(currentMatchId);
          } catch (error) {
            handleError(error, 'vid uppdatering av match');
          }
        }, 
        () => showMatch(currentMatchId),
        async () => {
          const matchName = `${match.date || 'match'} vs ${match.opponent || 'TBD'}`;
          const confirmed = await confirmDelete('matchen', matchName);
          if (!confirmed) return;
          
          try {
            showLoading(document.getElementById('teamContent'), "Tar bort match...");
            await deleteMatch(currentTeamId, currentMatchId);
            showSuccess('Match borttagen');
            showActivities();
          } catch (error) {
            handleError(error, 'vid borttagning av match');
          }
        }
      );
    })
    .catch(error => {
      handleError(error, 'vid laddning av matchuppgifter');
      showActivities();
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
      showErrorToast('Match hittades inte');
      showActivities();
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
          showSuccess('Trupp sparad!');
          showMatch(matchId); // Tillbaka till matchdetaljer
        } catch (error) {
          handleError(error, 'vid sparande av trupp');
        }
      },
      () => showMatch(matchId) // Tillbaka utan att spara
    );
  }).catch(error => {
    handleError(error, 'vid laddning av spelartrupp-data');
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
      showErrorToast('Match hittades inte');
      showActivities();
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
      try {
        await saveSetLineup(currentTeamId, matchId, setNumber, lineupData);
        showSuccess(`Set ${setNumber} laguppställning sparad!`);
      } catch (error) {
        handleError(error, 'vid sparande av laguppställning');
      }
    };
  }).catch(error => {
    handleError(error, 'vid laddning av laguppställnings-data');
  });
}

// Starta appen med startvyn
showStart();
