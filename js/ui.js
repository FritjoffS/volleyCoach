// ui.js

// Översätt engelska positioner till svenska för visning
/*function translatePositionToSwedish(englishPosition) {
  const translations = {
    'Setter': 'Passare',
    'Opposite': 'Högerspiker',
    'Wing-spiker': 'Vänsterspiker',
    'Wing-Spiker': 'Vänsterspiker',
    'Middle-Blocker': 'Center',
    'Libero': 'Libero'
  };
  return translations[englishPosition] || englishPosition;
}

// Översätt svenska positioner till engelska för lagring
function translatePositionToEnglish(swedishPosition) {
  const translations = {
    'Passare': 'Setter',
    'Högerspiker': 'Opposite',
    'Vänsterspiker': 'Wing-spiker',
    'Center': 'Middle-Blocker',
    'Libero': 'Libero'
  };
  return translations[swedishPosition] || swedishPosition;
}*/

// Renderar startsida med lista över lag och knapp för nytt lag
export function renderStart(appDiv, teams, onTeamSelect, onNewTeam) {
  appDiv.innerHTML = `
    <h2>Start</h2>
    <ul>
      ${Object.keys(teams || {}).map(id => 
        `<li><button onclick="window.selectTeam('${id}')">${teams[id].name}</button></li>`
      ).join('')}
    </ul>
    <button onclick="window.newTeam()">Nytt lag</button>
  `;
  window.selectTeam = onTeamSelect;
  window.newTeam = onNewTeam;
}

// Renderar sidan för att skapa nytt lag
export function renderNewTeam(appDiv, onSave, onCancel) {
  appDiv.innerHTML = `
    <h2>Nytt Lag</h2>
    <label>Lagnamn: <input id="teamName" type="text"></label><br>
    <label>Typ: 
      <select id="teamType">
        <option value="Dam">Dam</option>
        <option value="Herr">Herr</option>
        <option value="Mix">Mix</option>
      </select>
    </label><br>
    <label>Speltyp: 
      <select id="teamMode">
        <option value="6manna">6 manna</option>
        <option value="4manna">4 manna</option>
        <option value="Beach">Beach</option>
      </select>
    </label><br>
    <button id="saveTeam">Spara</button>
    <button id="cancel">Avbryt</button>
  `;
  document.getElementById('saveTeam').onclick = () => {
    const name = document.getElementById('teamName').value.trim();
    const type = document.getElementById('teamType').value;
    const mode = document.getElementById('teamMode').value;
    if(name) onSave({ name, type, mode });
  };
  document.getElementById('cancel').onclick = onCancel;
}

// Renderar lagets sida med meny för aktiviteter och spelare
export function renderTeam(appDiv, team, onShowActivities, onShowPlayers, onEditTeam, onBack) {
  appDiv.innerHTML = `
      <div class="team-header">
      <h2>${team.name}</h2>
      <div class="team-header-buttons">
        <button onclick="window.gotoStart()">← Till Startsida</button>
        <button onclick="window.editTeam()">Redigera Lag</button>
      </div>
    </div>
    <nav>
      <button onclick="window.showActivities()">Aktiviteter</button>
      <button onclick="window.showPlayers()">Spelare</button>
    </nav>
    <div id="teamContent"></div>
  `;

  window.back = onBack;
  window.editTeam = onEditTeam;
  window.showActivities = () => {
    onShowActivities('activities');
  };
  window.showPlayers = () => {
    onShowPlayers('players');
  };

  // Säkerställ att header och nav är synliga när team-vyn renderas
  const headerButtons = document.querySelector('.team-header-buttons');
  if (headerButtons) headerButtons.classList.remove('hidden');
  const teamNav = document.querySelector('nav');
  if (teamNav) teamNav.classList.remove('hidden');
}

// Renderar aktiviteter (träningar och matcher) för laget
export function renderActivities(appDiv, activities, onNewTraining, onNewMatch, onSelectTraining, onSelectMatch, onBack = null) {
  appDiv.innerHTML = `
    <h2>Aktiviteter</h2>
    <div class="action-buttons">
      ${onBack ? '<button onclick="window.backToTeam()" style="background-color: #6c757d;">← Tillbaka till lag</button>' : ''}
      <button onclick="window.newTraining()">Ny Träning</button>
      <button onclick="window.newMatch()">Ny Match</button>
    </div>

    <div class="activities-content">
      <section class="activities-section">
        <h4>Träningar</h4>
        <ul>
          ${activities.trainings ? Object.entries(activities.trainings).map(([id, t]) =>
            `<li><button onclick="window.selectTraining('${id}')">${t.date || 'Ny träning'} - ${t.time || ''}</button></li>`
          ).join('') : `<li>Inga träningar</li>`}
        </ul>
      </section>

      <section class="activities-section">
        <h4>Matcher</h4>
        <ul>
          ${activities.matches ? Object.entries(activities.matches).map(([id, m]) =>
            `<li><button onclick="window.selectMatch('${id}')">${m.date || 'Ny match'} vs ${m.opponent || 'TBD'}</button></li>`
          ).join('') : `<li>Inga matcher</li>`}
        </ul>
      </section>
    </div>
  `;
  window.newTraining = onNewTraining;
  window.newMatch = onNewMatch;
  window.selectTraining = onSelectTraining;
  window.selectMatch = onSelectMatch;
  if(onBack) window.backToTeam = onBack;

  // Dölj globala team-header-knappar och nav i aktivitetsdialogen så att
  // "← Till Startsida", "Redigera Lag", "Aktiviteter" och "Spelare" inte syns här.
  const headerButtons = document.querySelector('.team-header-buttons');
  if (headerButtons) headerButtons.classList.add('hidden');
  const teamNav = document.querySelector('nav');
  if (teamNav) teamNav.classList.add('hidden');
}

// Renderar detaljerad vy för en spelare
export function renderPlayer(appDiv, player, onEditPlayer, onBack) {
  const stats = player.stats || {};
  const attendanceCount = stats.trainingsAttended || 0;
  const totalTrainings = stats.totalTrainings || 0;
  const attendancePercent = totalTrainings > 0 ? Math.round((attendanceCount / totalTrainings) * 100) : 0;
  
  appDiv.innerHTML = `
    <div class="player-detail">
      <h3>Spelare: ${player.name}</h3>
      <div class="player-info">
        <div class="info-section">
          <h4>Grunduppgifter</h4>
          <p><strong>Position:</strong> ${player.position || '-'}</p>
          <p><strong>Nummer:</strong> ${player.number || '-'}</p>
          <p><strong>Kontakt:</strong> ${player.contactInfo || '-'}</p>
        </div>
        
        <div class="info-section">
          <h4>Statistik</h4>
          <p><strong>Träningar närvarande:</strong> ${attendanceCount} av ${totalTrainings}</p>
          <p><strong>Närvaro:</strong> ${attendancePercent}%</p>
          <div class="attendance-bar">
            <div class="attendance-fill" style="width: ${attendancePercent}%"></div>
          </div>
          <p><strong>Matcher spelade:</strong> ${stats.matchesPlayed || 0}</p>
          <p><strong>Poäng totalt:</strong> ${stats.totalPoints || 0}</p>
        </div>
      </div>
      
      <div class="player-actions">
        <button onclick="window.editPlayer()">Redigera Spelare</button>
        <button onclick="window.back()">Tillbaka</button>
      </div>
    </div>
  `;
  window.editPlayer = onEditPlayer;
  window.back = onBack;
}

// Rendera lista med spelare
export function renderPlayers(appDiv, players, onNewPlayer, onSelectPlayer, onBack = null) {
  appDiv.innerHTML = `
    <h2>Spelare</h2>
    <div class="action-buttons">
      ${onBack ? '<button onclick="window.backToTeam()" style="background-color: #6c757d;">← Tillbaka till lag</button>' : ''}
      <button onclick="window.newPlayer()">Ny Spelare</button>
    </div>

    <div class="activities-content">
      <section class="activities-section">
        <h4>Spelare</h4>
        <ul>
          ${players ? Object.entries(players)
            .sort(([,a], [,b]) => (a.name || '').localeCompare(b.name || '', 'sv'))
            .map(([id, p]) =>
              `<li><button onclick="window.selectPlayer('${id}')">${p.name} ${p.number ? `(#${p.number})` : ''} ${p.position ? `- ${p.position}` : ''}</button></li>`
            ).join('') : '<li>Inga spelare</li>'}
        </ul>
      </section>
    </div>
  `;
  window.newPlayer = onNewPlayer;
  window.selectPlayer = onSelectPlayer;
  if(onBack) window.backToTeam = onBack;

  // Dölj globala team-header-knappar och nav i spelar-dialogen
  const headerButtons = document.querySelector('.team-header-buttons');
  if (headerButtons) headerButtons.classList.add('hidden');
  const teamNav = document.querySelector('nav');
  if (teamNav) teamNav.classList.add('hidden');
}

// Rendera formulär för ny eller redigera spelare
export function renderPlayerForm(appDiv, player, onSave, onCancel, onDelete = null) {
  const isEdit = !!player;
  appDiv.innerHTML = `
    <h3>${isEdit ? "Redigera Spelare" : "Ny Spelare"}</h3>
    <label>Namn: <input id="playerName" type="text" value="${player?.name || ''}" placeholder="Spelarens fullständiga namn"></label>
    <label>Position: 
      <select id="playerPosition">
        <option value="">Välj position...</option>
        <option value="Passare" ${(player?.position === 'Passare' || player?.position === 'Setter') ? 'selected' : ''}>Passare</option>
        <option value="Högerspiker" ${(player?.position === 'Högerspiker' || player?.position === 'Opposite') ? 'selected' : ''}>Högerspiker</option>
        <option value="Vänsterspiker" ${(player?.position === 'Vänsterspiker' || player?.position === 'Wing-spiker' || player?.position === 'Wing-Spiker') ? 'selected' : ''}>Vänsterspiker</option>
        <option value="Center" ${(player?.position === 'Center' || player?.position === 'Middle-Blocker') ? 'selected' : ''}>Center</option>
        <option value="Libero" ${player?.position === 'Libero' ? 'selected' : ''}>Libero</option>
      </select>
    </label>
    <label>Nummer: <input id="playerNumber" type="number" value="${player?.number || ''}" min="1" max="99" placeholder="Tröjnummer"></label>
    <label>Kontakt: <input id="playerContact" type="text" value="${player?.contactInfo || ''}" placeholder="E-post eller telefonnummer"></label>
    <button id="savePlayer">${isEdit ? 'Spara' : 'Lägg till'}</button>
    <button id="cancelPlayer">Avbryt</button>
    ${isEdit && onDelete ? '<button id="deletePlayer" style="background-color: #dc3545; color: white;">Ta bort spelare</button>' : ''}
  `;
  document.getElementById('savePlayer').onclick = () => {
    const newPlayer = {
      name: document.getElementById('playerName').value.trim(),
      position: document.getElementById('playerPosition').value.trim(),
      number: document.getElementById('playerNumber').value,
      contactInfo: document.getElementById('playerContact').value.trim(),
    };
    if(newPlayer.name) onSave(newPlayer);
  };
  document.getElementById('cancelPlayer').onclick = onCancel;
  
  if(isEdit && onDelete && document.getElementById('deletePlayer')) {
    document.getElementById('deletePlayer').onclick = onDelete;
  }
}

// Renderar formulär för att redigera lag
export function renderEditTeam(appDiv, team, onSave, onCancel, onDelete) {
  appDiv.innerHTML = `
    <h2>Redigera Lag</h2>
    <label>Lagnamn: <input id="editTeamName" type="text" value="${team.name}"></label><br>
    <label>Typ: 
      <select id="editTeamType">
        <option value="Dam" ${team.type === 'Dam' ? 'selected' : ''}>Dam</option>
        <option value="Herr" ${team.type === 'Herr' ? 'selected' : ''}>Herr</option>
        <option value="Mix" ${team.type === 'Mix' ? 'selected' : ''}>Mix</option>
      </select>
    </label><br>
    <label>Speltyp: 
      <select id="editTeamMode">
        <option value="6manna" ${team.mode === '6manna' ? 'selected' : ''}>6 manna</option>
        <option value="4manna" ${team.mode === '4manna' ? 'selected' : ''}>4 manna</option>
        <option value="Beach" ${team.mode === 'Beach' ? 'selected' : ''}>Beach</option>
      </select>
    </label><br>
    <button id="saveEditTeam">Spara ändringar</button>
    <button id="cancelEditTeam">Avbryt</button>
    <button id="deleteTeam" style="background-color: #dc3545; color: white; margin-left: 20px;">Ta bort lag</button>
  `;
  
  document.getElementById('saveEditTeam').onclick = () => {
    const name = document.getElementById('editTeamName').value.trim();
    const type = document.getElementById('editTeamType').value;
    const mode = document.getElementById('editTeamMode').value;
    if(name) onSave({ name, type, mode });
  };
  document.getElementById('cancelEditTeam').onclick = onCancel;
  document.getElementById('deleteTeam').onclick = onDelete;
}

// Renderar formulär för träning
export function renderTrainingForm(appDiv, training, onSave, onCancel, onDelete = null) {
  const isEdit = !!training;
  appDiv.innerHTML = `
    <h3>${isEdit ? "Redigera Träning" : "Ny Träning"}</h3>
    <label>Datum: <input id="trainingDate" type="date" value="${training?.date || ''}"></label><br>
    <label>Tid: <input id="trainingTime" type="time" value="${training?.time || ''}"></label><br>
    <label>Plats: <input id="trainingLocation" type="text" value="${training?.location || ''}" placeholder="Gymnastiksal, volleybollhall..."></label><br>
    <label>Fokus: <input id="trainingFocus" type="text" value="${training?.focus || ''}" placeholder="Teknik, taktik, kondition..."></label><br>
    <label>Anteckningar: <textarea id="trainingNotes" rows="3">${training?.notes || ''}</textarea></label><br>
    <button id="saveTraining">${isEdit ? 'Spara' : 'Skapa'}</button>
    <button id="cancelTraining">Avbryt</button>
    ${isEdit && onDelete ? '<button id="deleteTraining" style="background-color: #dc3545; color: white; margin-left: 20px;">Ta bort</button>' : ''}
  `;
  
  document.getElementById('saveTraining').onclick = () => {
    const trainingData = {
      date: document.getElementById('trainingDate').value,
      time: document.getElementById('trainingTime').value,
      location: document.getElementById('trainingLocation').value.trim(),
      focus: document.getElementById('trainingFocus').value.trim(),
      notes: document.getElementById('trainingNotes').value.trim(),
    };
    if(trainingData.date) onSave(trainingData);
  };
  document.getElementById('cancelTraining').onclick = onCancel;
  
  if(isEdit && onDelete && document.getElementById('deleteTraining')) {
    document.getElementById('deleteTraining').onclick = onDelete;
  }
}

// Renderar formulär för match
export function renderMatchForm(appDiv, match, onSave, onCancel, onDelete = null) {
  const isEdit = !!match;
  appDiv.innerHTML = `
    <h3>${isEdit ? "Redigera Match" : "Ny Match"}</h3>
    <label>Datum: <input id="matchDate" type="date" value="${match?.date || ''}"></label><br>
    <label>Tid: <input id="matchTime" type="time" value="${match?.time || ''}"></label><br>
    <label>Motståndare: <input id="matchOpponent" type="text" value="${match?.opponent || ''}" placeholder="Lag att spela mot"></label><br>
    <label>Plats: <input id="matchLocation" type="text" value="${match?.location || ''}" placeholder="Hemma/Borta, hall..."></label><br>
    <label>Typ: 
      <select id="matchType">
        <option value="Träningsmatch" ${match?.type === 'Träningsmatch' ? 'selected' : ''}>Träningsmatch</option>
        <option value="Seriematch" ${match?.type === 'Seriematch' ? 'selected' : ''}>Seriematch</option>
        <option value="Cup" ${match?.type === 'Cup' ? 'selected' : ''}>Cup</option>
        <option value="Turnering" ${match?.type === 'Turnering' ? 'selected' : ''}>Turnering</option>
      </select>
    </label><br>
    <label>Resultat: <input id="matchResult" type="text" value="${match?.result || ''}" placeholder="3-1, 2-3, etc. (lämna tomt om ej spelad)"></label><br>
    <label>Anteckningar: <textarea id="matchNotes" rows="3">${match?.notes || ''}</textarea></label><br>
    <button id="saveMatch">${isEdit ? 'Spara' : 'Skapa'}</button>
    <button id="cancelMatch">Avbryt</button>
    ${isEdit && onDelete ? '<button id="deleteMatch" style="background-color: #dc3545; color: white; margin-left: 20px;">Ta bort</button>' : ''}
  `;
  
  document.getElementById('saveMatch').onclick = () => {
    const matchData = {
      date: document.getElementById('matchDate').value,
      time: document.getElementById('matchTime').value,
      opponent: document.getElementById('matchOpponent').value.trim(),
      location: document.getElementById('matchLocation').value.trim(),
      type: document.getElementById('matchType').value,
      result: document.getElementById('matchResult').value.trim(),
      notes: document.getElementById('matchNotes').value.trim(),
    };
    if(matchData.date && matchData.opponent) onSave(matchData);
  };
  document.getElementById('cancelMatch').onclick = onCancel;
  
  if(isEdit && onDelete && document.getElementById('deleteMatch')) {
    document.getElementById('deleteMatch').onclick = onDelete;
  }
}

// Renderar detaljvy för träning
export function renderTrainingDetail(appDiv, training, onEdit, onBack, onMarkAttendance = null) {
  const attendance = training.attendance || {};
  const attendanceCount = Object.keys(attendance).length;
  
  appDiv.innerHTML = `
    <div class="training-detail">
      <h3>Träning - ${training.date}</h3>
      <div class="training-info">
        <p><strong>Tid:</strong> ${training.time || '-'}</p>
        <p><strong>Plats:</strong> ${training.location || '-'}</p>
        <p><strong>Fokus:</strong> ${training.focus || '-'}</p>
        <p><strong>Närvarande spelare:</strong> ${attendanceCount}</p>
      </div>
      
      ${training.notes ? `
        <div class="notes-section">
          <strong>Anteckningar:</strong><br>
          ${training.notes}
        </div>
      ` : ''}
      
      ${Object.keys(attendance).length > 0 ? `
        <div class="attendance-section">
          <h4>Närvarolista</h4>
          <ul class="attendance-list">
            ${Object.entries(attendance).map(([playerId, playerName]) => 
              `<li>✓ ${playerName}</li>`
            ).join('')}
          </ul>
        </div>
      ` : ''}
      
      <div class="training-actions">
        ${onMarkAttendance ? '<button onclick="window.markAttendance()">Markera närvaro</button>' : ''}
        <button onclick="window.editTraining()">Redigera</button>
        <button onclick="window.back()">Tillbaka</button>
      </div>
    </div>
  `;
  window.editTraining = onEdit;
  window.back = onBack;
  if(onMarkAttendance) window.markAttendance = onMarkAttendance;
}

// Renderar detaljvy för match
export function renderMatchDetail(appDiv, match, onEdit, onBack, onManageSquad = null, onManageLineups = null) {
  const squad = match.squad || {};
  const squadCount = Object.keys(squad).length;
  
  appDiv.innerHTML = `
    <div class="match-detail">
      <div class="breadcrumb">
        <span>Lag</span> → <span>Aktiviteter</span> → <span class="current">Match ${match.date}</span>
      </div>
      
      <h3>Match - ${match.date}</h3>
      <div class="match-info">
        <p><strong>Tid:</strong> ${match.time || '-'}</p>
        <p><strong>Motståndare:</strong> ${match.opponent}</p>
        <p><strong>Plats:</strong> ${match.location || '-'}</p>
        <p><strong>Typ:</strong> ${match.type}</p>
        <p><strong>Resultat:</strong> ${match.result || 'Ej spelad'}</p>
        <p><strong>Spelare i truppen:</strong> ${squadCount}</p>
      </div>
      
      ${squadCount > 0 ? `
        <div class="squad-section">
          <h4>Spelartrupp (${squadCount})</h4>
          <div class="squad-list">
            ${Object.entries(squad).map(([playerId, playerInfo]) => `
              <div class="squad-player">
                <span class="player-number">${playerInfo.number || '?'}</span>
                <span class="player-name">${playerInfo.name}</span>
                <span class="player-position">${playerInfo.position || ''}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <div class="no-squad">
          <p>Ingen spelartrupp vald än.</p>
        </div>
      `}
      
      ${match.notes ? `
        <div class="notes-section">
          <strong>Anteckningar:</strong><br>
          ${match.notes}
        </div>
      ` : ''}
      
      <div class="match-actions">
        ${onManageSquad ? '<button onclick="window.manageSquad()" style="background-color: #28a745;">Hantera trupp</button>' : ''}
        ${onManageSquad ? '<button onclick="window.manageLineups()" style="background-color: #17a2b8;">Laguppställningar</button>' : ''}
        <button onclick="window.editMatch()">Redigera match</button>
        <button onclick="window.back()">Tillbaka</button>
      </div>
    </div>
  `;
  window.editMatch = onEdit;
  window.back = onBack;
  if(onManageSquad) window.manageSquad = onManageSquad;
  if(onManageLineups) window.manageLineups = onManageLineups;
}

// Lägg till laddningsindikator
export function showLoading(appDiv, message = "Laddar...") {
  appDiv.innerHTML = `
    <div style="text-align: center; padding: 50px;">
      <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <p>${message}</p>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
}

// Visa felmeddelande
export function showError(appDiv, message, onRetry = null) {
  appDiv.innerHTML = `
    <div style="text-align: center; padding: 50px; color: #dc3545;">
      <h3>Ett fel uppstod</h3>
      <p>${message}</p>
      ${onRetry ? '<button onclick="window.retry()">Försök igen</button>' : ''}
    </div>
  `;
  if(onRetry) window.retry = onRetry;
}

// Renderar spelartrupp-hantering för match
export function renderSquadManager(appDiv, match, allPlayers, onSave, onBack) {
  const currentSquad = match.squad || {};
  const availablePlayers = Object.entries(allPlayers || {}).filter(([id, player]) => player && player.name);
  
  appDiv.innerHTML = `
    <div class="squad-manager">
      <div class="breadcrumb">
        <span>Lag</span> → <span>Aktiviteter</span> → <span>Match ${match.date}</span> → <span class="current">Trupp</span>
      </div>
      
      <h3>Hantera trupp - ${match.opponent}</h3>
      <p class="match-info-small">${match.date} ${match.time || ''} - ${match.location || ''}</p>
      
      <div class="squad-sections">
        <div class="available-players">
          <h4>Tillgängliga spelare</h4>
          <div class="player-list" id="availablePlayers">
            ${availablePlayers.map(([playerId, player]) => {
              const isInSquad = currentSquad[playerId];
              return `
                <div class="player-card ${isInSquad ? 'in-squad' : 'available'}" data-player-id="${playerId}">
                  <div class="player-info">
                    <span class="player-number">${player.number || '?'}</span>
                    <span class="player-name">${player.name}</span>
                    <span class="player-position">${player.position || ''}</span>
                  </div>
                  <button class="toggle-player" data-player-id="${playerId}">
                    ${isInSquad ? '✗ Ta bort' : '✓ Lägg till'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="selected-squad">
          <h4>Vald trupp (<span id="squadCount">${Object.keys(currentSquad).length}</span>)</h4>
          <div class="squad-list" id="selectedSquad">
            ${Object.entries(currentSquad).map(([playerId, playerInfo]) => `
              <div class="squad-player" data-player-id="${playerId}">
                <span class="player-number">${playerInfo.number || '?'}</span>
                <span class="player-name">${playerInfo.name}</span>
                <span class="player-position">${playerInfo.position || ''}</span>
                <button class="remove-btn" data-player-id="${playerId}">✗</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="squad-actions">
        <button id="saveSquad">Spara trupp</button>
        <button id="cancelSquad">Tillbaka utan att spara</button>
        <button id="clearSquad" style="background-color: #dc3545;">Rensa trupp</button>
      </div>
    </div>
  `;
  
  // Setup squad manager functionality
  let currentSquadData = {...currentSquad};
  let allPlayersData = Object.fromEntries(availablePlayers);
  
  function togglePlayer(playerId) {
    const player = allPlayersData[playerId];
    if (!player) return;
    
    if (currentSquadData[playerId]) {
      // Ta bort från trupp
      delete currentSquadData[playerId];
    } else {
      // Lägg till i trupp
      currentSquadData[playerId] = {
        name: player.name,
        number: player.number,
        position: player.position
      };
    }
    
    updateSquadDisplay();
  }
  
  function clearSquad() {
    if (confirm('Är du säker på att du vill rensa hela truppen?')) {
      currentSquadData = {};
      updateSquadDisplay();
    }
  }
  
  function updateSquadDisplay() {
    const squadCount = Object.keys(currentSquadData).length;
    document.getElementById('squadCount').textContent = squadCount;
    
    // Uppdatera tillgängliga spelare
    document.querySelectorAll('.player-card').forEach(card => {
      const playerId = card.dataset.playerId;
      const isInSquad = currentSquadData[playerId];
      const button = card.querySelector('.toggle-player');
      
      card.className = 'player-card ' + (isInSquad ? 'in-squad' : 'available');
      button.textContent = isInSquad ? '✗ Ta bort' : '✓ Lägg till';
    });
    
    // Uppdatera vald trupp
    const selectedSquad = document.getElementById('selectedSquad');
    selectedSquad.innerHTML = Object.entries(currentSquadData).map(([playerId, playerInfo]) => 
      `<div class="squad-player" data-player-id="${playerId}">
        <span class="player-number">${playerInfo.number || '?'}</span>
        <span class="player-name">${playerInfo.name}</span>
        <span class="player-position">${playerInfo.position || ''}</span>
        <button class="remove-btn" data-player-id="${playerId}">✗</button>
      </div>`
    ).join('');
    
    // Re-attach event listeners for new remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.onclick = () => togglePlayer(btn.dataset.playerId);
    });
  }
  
  // Event listeners
  document.querySelectorAll('.toggle-player').forEach(btn => {
    btn.onclick = () => togglePlayer(btn.dataset.playerId);
  });
  
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => togglePlayer(btn.dataset.playerId);
  });
  
  document.getElementById('saveSquad').onclick = () => {
    onSave(currentSquadData);
  };
  
  document.getElementById('cancelSquad').onclick = onBack;
  
  document.getElementById('clearSquad').onclick = clearSquad;
  
  // Setup global references
  window.saveSquadData = onSave;
  window.back = onBack;
}

// Renderar laguppställnings-hantering för match
export function renderLineupManager(appDiv, match, matchLineups, squadPlayers, onSave, onBack) {
  const lineups = matchLineups || {};
  const availablePlayers = Object.entries(squadPlayers || {}).filter(([id, player]) => player && player.name);
  
  appDiv.innerHTML = `
    <div class="lineup-manager">
      <div class="breadcrumb">
        <span>Lag</span> → <span>Aktiviteter</span> → <span>Match ${match.date}</span> → <span class="current">Laguppställningar</span>
      </div>
      
      <h3>Laguppställningar - ${match.opponent}</h3>
      <p class="match-info-small">${match.date} ${match.time || ''} - ${match.location || ''}</p>
      
      <div class="lineup-tabs">
        <button class="tab-button active" data-set="1">Set 1</button>
        <button class="tab-button" data-set="2">Set 2</button>
        <button class="tab-button" data-set="3">Set 3</button>
        <button class="tab-button" data-set="4">Set 4</button>
        <button class="tab-button" data-set="5">Set 5</button>
      </div>
      
      <div class="lineup-content">
        <div class="current-set-info">
          <h4>Set <span id="currentSetNumber">1</span></h4>
          <p class="lineup-hint">
            <span class="lineup-hint-icon">👆</span>
            Tryck på cirklarna för att välja spelare
          </p>
          <div class="lineup-status" id="lineupStatus">
            <span class="status-indicator incomplete">Ofullständig uppställning</span>
          </div>
        </div>
        
        <div class="court-header">ROTATIONSORDNING</div>
        <div class="volleyball-court">
          <div class="court-grid">
            <div class="position-slot" data-position="4">
              <div class="position-number">4</div>
              <div class="player-slot" id="pos4">
                <select class="position-select" data-position="4">
                  <option value="">Välj spelare...</option>
                </select>
              </div>
            </div>
            <div class="position-slot" data-position="3">
              <div class="position-number">3</div>
              <div class="player-slot" id="pos3">
                <select class="position-select" data-position="3">
                  <option value="">Välj spelare...</option>
                </select>
              </div>
            </div>
            <div class="position-slot" data-position="2">
              <div class="position-number">2</div>
              <div class="player-slot" id="pos2">
                <select class="position-select" data-position="2">
                  <option value="">Välj spelare...</option>
                </select>
              </div>
            </div>
            
            <div class="position-slot" data-position="5">
              <div class="position-number">5</div>
              <div class="player-slot" id="pos5">
                <select class="position-select" data-position="5">
                  <option value="">Välj spelare...</option>
                </select>
              </div>
            </div>
            <div class="position-slot" data-position="6">
              <div class="position-number">6</div>
              <div class="player-slot" id="pos6">
                <select class="position-select" data-position="6">
                  <option value="">Välj spelare...</option>
                </select>
              </div>
            </div>
            <div class="position-slot" data-position="1">
              <div class="position-number">1</div>
              <div class="player-slot" id="pos1">
                <select class="position-select" data-position="1">
                  <option value="">Välj spelare...</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div class="libero-section">
          <h5>Libero (max 2)</h5>
          <div class="libero-slots">
            <div class="libero-slot">
              <label>Libero 1:</label>
              <select id="libero1Select">
                <option value="">Välj libero...</option>
              </select>
            </div>
            <div class="libero-slot">
              <label>Libero 2:</label>
              <select id="libero2Select">
                <option value="">Välj libero...</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="lineup-actions">
            <button id="saveLineup">Spara Set <span id="saveSetNumber">1</span></button>
            <button id="rotateCW" title="Rotera medurs">Rotera medurs ▶</button>
            <button id="rotateCCW" title="Rotera moturs">◀ Rotera moturs</button>
          <button id="copyFromPrevious">Kopiera från föregående set</button>
          <button id="clearLineup">Rensa uppställning</button>
          <button id="backToMatch">Tillbaka till match</button>
        </div>
      </div>
    </div>
  `;
  
  // Setup lineup functionality
  let currentSet = 1;
  let currentLineups = {...lineups};
  
  // Ladda uppställning för aktuellt set
  function loadLineup(setNumber) {
    console.log('Laddar uppställning för set', setNumber);
    const lineup = currentLineups[`set${setNumber}`];
    console.log('Laddar uppställning:', lineup);
    
    // STEG 1: Rensa alla val FÖRST så att inga spelare är "upptagna"
    document.querySelectorAll('.position-select').forEach(select => {
      select.value = '';
      console.log(`Rensade position ${select.dataset.position}`);
    });
    document.getElementById('libero1Select').value = '';
    console.log('Rensade libero 1');
    document.getElementById('libero2Select').value = '';
    console.log('Rensade libero 2');
    
    // STEG 2: Bygg om dropdowns med alla tillgängliga spelare (nu när allt är rensat)
    updateAvailablePlayers();
    
    // STEG 3: Sätt värden från sparad lineup
    if (lineup) {
      // Ladda positioner - lägg till options om de saknas
      Object.entries(lineup.positions || {}).forEach(([pos, playerId]) => {
        const select = document.querySelector(`select[data-position="${pos}"]`);
        console.log(`Laddar position ${pos} med spelare ${playerId}`);
        if (!select) return;

        // Om option för playerId saknas, skapa en fallback-option så att value kan sättas
        if (![...select.options].some(o => o.value === playerId)) {
          const player = (squadPlayers && squadPlayers[playerId]) || null;
          const label = player ? ` (${player.number || '?'}) ${player.name} - ${player.position || 'Okänd position'}` : playerId;
          const opt = document.createElement('option');
          opt.value = playerId;
          opt.text = label;
          select.add(opt);
        }
        select.value = playerId;
      });
      
      // Ladda libero (stöd för både gamla och nya format)
      const l1 = lineup.libero1 || lineup.libero || null;
      const l2 = lineup.libero2 || null;
      const lib1Sel = document.getElementById('libero1Select');
      const lib2Sel = document.getElementById('libero2Select');
      
      if (lib1Sel && l1) {
        if (![...lib1Sel.options].some(o => o.value === l1)) {
          const p = (squadPlayers && squadPlayers[l1]) || null;
          const opt = document.createElement('option');
          opt.value = l1;
          opt.text = p ? `${p.name} (#${p.number || '?'}) - ${p.position || 'Okänd position'}` : l1;
          lib1Sel.add(opt);
        }
        lib1Sel.value = l1;
      }
      
      if (lib2Sel && l2) {
        if (![...lib2Sel.options].some(o => o.value === l2)) {
          const p = (squadPlayers && squadPlayers[l2]) || null;
          const opt = document.createElement('option');
          opt.value = l2;
          opt.text = p ? `${p.name} (#${p.number || '?'}) - ${p.position || 'Okänd position'}` : l2;
          lib2Sel.add(opt);
        }
        lib2Sel.value = l2;
      }
    }
    
    // STEG 4: Uppdatera status och visuella element
    updateLineupStatus();
    console.log('Uppställning laddad för set', setNumber);
    // Uppdatera cirklarna för att visa valda spelare
    updatePlayerCircles();
  }
  
  // Uppdatera status för uppställning
  function updateLineupStatus() {
    const positions = document.querySelectorAll('.position-select');
    const filledPositions = Array.from(positions).filter(select => select.value).length;
    const libero1 = document.getElementById('libero1Select').value;
    const libero2 = document.getElementById('libero2Select').value;
    const liberoCount = (libero1 ? 1 : 0) + (libero2 ? 1 : 0);
    
    const statusElement = document.getElementById('lineupStatus');
    const isComplete = filledPositions === 6;
    
    let statusText = isComplete 
      ? '<span class="status-indicator complete">Komplett uppställning ✓</span>'
      : `<span class="status-indicator incomplete">Ofullständig (${filledPositions}/6 positioner)</span>`;
    
    // Visa libero-info som extra information
    if (liberoCount > 0) {
      statusText += isComplete 
        ? `<span class="libero-info"> + ${liberoCount} Libero${liberoCount > 1 ? 's' : ''}</span>`
        : `<span class="libero-info"> + ${liberoCount} Libero${liberoCount > 1 ? 's' : ''} vald${liberoCount > 1 ? 'a' : ''}</span>`;
    }
    
    statusElement.innerHTML = statusText;
  }
  
  // Uppdatera tillgängliga spelare i alla dropdown-menyer
  function updateAvailablePlayers() {
    // Samla alla valda spelare
    const selectedPlayers = new Set();
    
    // Lägg till spelare från positioner
    document.querySelectorAll('.position-select').forEach(select => {
      if (select.value) selectedPlayers.add(select.value);
    });
    
    // Lägg till libero (båda)
    const libero1Value = document.getElementById('libero1Select').value;
    const libero2Value = document.getElementById('libero2Select').value;
    if (libero1Value) selectedPlayers.add(libero1Value);
    if (libero2Value) selectedPlayers.add(libero2Value);
    
    // Uppdatera alla position-dropdown-menyer
    document.querySelectorAll('.position-select').forEach(select => {
      const currentValue = select.value;
      
      let optionsHTML = '<option value="">Välj spelare...</option>';
      
      // Lägg till alla tillgängliga spelare
      availablePlayers.forEach(([id, p]) => {
        // Visa spelare endast om den inte är vald någon annanstans, eller om det är den nuvarande valda
        if (!selectedPlayers.has(id) || id === currentValue) {
          /* optionsHTML += `<option value="${id}">${p.name} (#${p.number || '?'}) - ${p.position || 'Okänd position'}</option>`; */
          optionsHTML += `<option value="${id}"> (${p.number || '?'}) ${p.name} - ${p.position || 'Okänd position'}</option>`;
        }
      });
      
      select.innerHTML = optionsHTML;
      select.value = currentValue; // Behåll det valda värdet
    });
    
    // Uppdatera libero-dropdowns (båda)
    ['libero1Select', 'libero2Select'].forEach(selectId => {
      const liberoSelect = document.getElementById(selectId);
      const currentLiberoValue = liberoSelect.value;
      
      let liberoOptionsHTML = '<option value="">Välj libero...</option>';
      
      // Lägg till alla tillgängliga spelare
      availablePlayers.forEach(([id, p]) => {
        if (!selectedPlayers.has(id) || id === currentLiberoValue) {
          liberoOptionsHTML += `<option value="${id}">${p.name} (#${p.number || '?'}) - ${p.position || 'Okänd position'}</option>`;
        }
      });
      
      liberoSelect.innerHTML = liberoOptionsHTML;
        liberoSelect.value = currentLiberoValue; // Behåll det valda värdet
    });

    // Uppdatera visuella cirklar för spelare
    updatePlayerCircles();
  }

  // Skapa/uppdatera cirklar som visar spelarens nummer för varje position
  function updatePlayerCircles() {
    const positions = ['4','3','2','5','6','1'];
    positions.forEach(pos => {
      const slot = document.querySelector(`.position-slot[data-position="${pos}"]`);
      if (!slot) return;
      let circle = slot.querySelector('.player-circle');
      const select = slot.querySelector('select.position-select');
      const playerId = select ? select.value : '';
      if (!circle) {
        circle = document.createElement('div');
        circle.className = 'player-circle empty clickable';
        slot.insertBefore(circle, slot.querySelector('.player-slot'));
      }
      if (playerId) {
        // Försök hitta spelarens nummer från squadPlayers eller från option-text
        let num = '';
        if (squadPlayers && squadPlayers[playerId] && squadPlayers[playerId].number) {
          num = squadPlayers[playerId].number;
        } else {
          const opt = select.querySelector(`option[value="${playerId}"]`);
          if (opt) {
            const m = opt.text.match(/#(\d+)/);
            if (m) num = m[1];
          }
        }
        circle.textContent = num || '•';
        circle.classList.remove('empty');
      } else {
        circle.textContent = '';
        circle.classList.add('empty');
      }
    });

    // Libero circles
    const liberoSlots = ['libero1','libero2'];
    liberoSlots.forEach((key, idx) => {
      const container = document.querySelector(`.libero-slot:nth-child(${idx+1})`);
      if (!container) return;
      let circle = container.querySelector('.player-circle');
      const select = document.getElementById(key + 'Select');
      const playerId = select ? select.value : '';
      if (!circle) {
        circle = document.createElement('div');
        circle.className = 'player-circle empty clickable';
        // insert before the select (which is visually hidden)
        container.insertBefore(circle, container.firstChild);
      }
      if (playerId) {
        let num = '';
        if (squadPlayers && squadPlayers[playerId] && squadPlayers[playerId].number) {
          num = squadPlayers[playerId].number;
        } else {
          const opt = select && select.querySelector(`option[value="${playerId}"]`);
          if (opt) {
            const m = opt.text.match(/#(\d+)/);
            if (m) num = m[1];
          }
        }
        circle.textContent = num || '•';
        circle.classList.remove('empty');
      } else {
        circle.textContent = '';
        circle.classList.add('empty');
      }
    });
  }

  // --- Player picker popup implementation ---
  // Create a single picker element that we reuse
  let activePicker = null;
  function createPicker() {
    const picker = document.createElement('div');
    picker.className = 'player-picker';
    picker.style.display = 'none';
    document.body.appendChild(picker);
    return picker;
  }

  function closePicker() {
    if (activePicker) {
      activePicker.style.display = 'none';
      activePicker.innerHTML = '';
      activePicker = null;
    }
  }

  // Build picker items for a given positionSlot and show at element
  function openPickerForSlot(slot) {
    if (!slot) return;
    // Ensure we have the picker
    if (!activePicker) activePicker = createPicker();
    const picker = activePicker;
    picker.innerHTML = '';

    // Determine which players are currently selected so we can filter
    const selectedPlayers = new Set();
    document.querySelectorAll('.position-select').forEach(s => { if (s.value) selectedPlayers.add(s.value); });
    const lib1 = document.getElementById('libero1Select')?.value; if (lib1) selectedPlayers.add(lib1);
    const lib2 = document.getElementById('libero2Select')?.value; if (lib2) selectedPlayers.add(lib2);

    // The underlying select for this slot
    const select = slot.querySelector('select.position-select');
    const currentVal = select ? select.value : '';

    // Populate items: allow currentVal and any not already selected
    availablePlayers.forEach(([id, p]) => {
      if (!id) return;
      if (selectedPlayers.has(id) && id !== currentVal) return; // skip
      const item = document.createElement('div');
      item.className = 'picker-item';
      item.dataset.playerId = id;
      item.innerHTML = `<div class="num">${p.number || '?'}</div><div class="name">${p.name} <span style="color:#666; font-size:12px;">${p.position ? ' - ' + p.position : ''}</span></div>`;
      item.onclick = () => {
        // Set select value and trigger change handlers
        if (select) {
          // If option missing, add fallback
          if (![...select.options].some(o => o.value === id)) {
            const opt = document.createElement('option');
            opt.value = id;
            opt.text = ` (${p.number || '?'}) ${p.name} - ${p.position || 'Okänd position'}`;
            select.add(opt);
          }
          select.value = id;
          // Trigger onchange logic
          select.onchange && select.onchange();
          updateLineupStatus();
          updateAvailablePlayers();
        }
        closePicker();
      };
      picker.appendChild(item);
    });

    // Add an explicit 'clear' item to empty the slot
    const clearItem = document.createElement('div');
    clearItem.className = 'picker-item';
    clearItem.innerHTML = `<div class="num">–</div><div class="name">Rensa plats</div>`;
    clearItem.onclick = () => {
      if (select) {
        select.value = '';
        select.onchange && select.onchange();
        updateLineupStatus();
        updateAvailablePlayers();
      }
      closePicker();
    };
    picker.appendChild(clearItem);

    // Position picker next to the slot's circle and ensure it stays inside the viewport
    const circle = slot.querySelector('.player-circle');
    const rect = circle.getBoundingClientRect();
    picker.style.display = 'block';
    picker.style.maxHeight = ''; // Reset max-height
    
    // Initial preferred placement: below the circle, centered on circle
    const preferTop = rect.bottom + 8 + window.scrollY;
    const preferLeft = rect.left + (rect.width / 2) + window.scrollX;
    picker.style.top = preferTop + 'px';
    picker.style.left = preferLeft + 'px';

    // Allow browser to calculate size
    // Re-measure using offsetWidth so width constraints from CSS are applied
    const pickerWidth = picker.offsetWidth || 180;
    const docWidth = document.documentElement.clientWidth || window.innerWidth;
    const docHeight = document.documentElement.clientHeight || window.innerHeight;
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + docHeight;

    // Compute adjusted left so picker stays within viewport (16px padding on mobile)
    const horizontalPadding = docWidth < 480 ? 16 : 8;
    let adjustedLeft = preferLeft - (pickerWidth / 2); // Center on circle
    
    // Ensure picker doesn't overflow right edge
    if (adjustedLeft + pickerWidth > docWidth - horizontalPadding + window.scrollX) {
      adjustedLeft = docWidth - horizontalPadding - pickerWidth + window.scrollX;
    }
    
    // Ensure picker doesn't overflow left edge
    adjustedLeft = Math.max(horizontalPadding + window.scrollX, adjustedLeft);

    // Compute vertical position and clamp
    const pickerHeight = picker.offsetHeight || 200;
    const verticalPadding = 16;
    let adjustedTop = preferTop;
    
    // Check if picker would overflow bottom of viewport
    if (adjustedTop + pickerHeight > viewportBottom - verticalPadding) {
      // Try placing above the circle
      const aboveTop = rect.top + window.scrollY - pickerHeight - 8;
      
      if (aboveTop >= viewportTop + verticalPadding) {
        // Fits above
        adjustedTop = aboveTop;
      } else {
        // Doesn't fit above or below - constrain height and place optimally
        const availableBelow = viewportBottom - preferTop - verticalPadding;
        const availableAbove = rect.top - viewportTop - verticalPadding;
        
        if (availableBelow >= availableAbove) {
          // Place below with constrained height
          adjustedTop = preferTop;
          picker.style.maxHeight = Math.max(120, availableBelow - 8) + 'px';
        } else {
          // Place above with constrained height
          adjustedTop = viewportTop + verticalPadding;
          picker.style.maxHeight = Math.max(120, availableAbove - 8) + 'px';
        }
      }
    }

    picker.style.left = adjustedLeft + 'px';
    picker.style.top = adjustedTop + 'px';
  }

  // Close picker on outside click or escape
  document.addEventListener('click', (e) => {
    if (!activePicker) return;
    if (e.target.closest('.player-picker')) return;
    if (e.target.closest('.player-circle')) return; // clicking another circle will open new picker
    closePicker();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePicker(); });
  
  // Close picker on orientation change (mobile)
  window.addEventListener('orientationchange', () => {
    closePicker();
  });
  
  // Close picker on scroll to avoid positioning issues
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (!activePicker) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      closePicker();
    }, 150);
  }, { passive: true });

  // Delegate click handlers to circles: open picker for that slot
  document.addEventListener('click', (e) => {
    const circle = e.target.closest('.player-circle.clickable');
    if (!circle) return;
    const slot = circle.closest('.position-slot');
    if (!slot) return;
    openPickerForSlot(slot);
  });

  // Rotera uppställningen ett steg medurs eller moturs (menar rotationsordning 1..6)
  function rotateLineup(direction) {
    const positions = ['1','2','3','4','5','6'];
    // Läs nuvarande värden
    const values = positions.map(p => {
      const s = document.querySelector(`select[data-position="${p}"]`);
      return s ? s.value : '';
    });

    let newValues;
    if (direction === 'cw') {
      // Rotera medurs: varje spelare flyttas till nästa position (1->2, 2->3, ..., 6->1)
      // För att flytta varje värde till nästa position läser vi värdet från föregående index
      newValues = positions.map((_, i) => values[(i + 1) % 6]); // shift left in array -> moves players forward one position
    } else {
      // Rotera moturs: varje spelare flyttas till föregående position (1->6, 2->1, ...)
      newValues = positions.map((_, i) => values[(i + 5) % 6]); // shift right in array -> moves players back one position
    }

    // Applicera nya värden, skapa fallback-option vid behov
    positions.forEach((pos, idx) => {
      const select = document.querySelector(`select[data-position="${pos}"]`);
      if (!select) return;
      const playerId = newValues[idx] || '';
      if (playerId && ![...select.options].some(o => o.value === playerId)) {
        const player = (squadPlayers && squadPlayers[playerId]) || null;
        const opt = document.createElement('option');
        opt.value = playerId;
        opt.text = player ? ` (${player.number || '?'}) ${player.name} - ${player.position || 'Okänd position'}` : playerId;
        select.add(opt);
      }
      select.value = playerId;
    });

    // Uppdatera libero-valen om rotation även påverkar dem (vi lämnar libero oförändrad)
    updateLineupStatus();
    updateAvailablePlayers();
  }
  
  // Event listeners för tabs
  const rotateCwBtn = document.getElementById('rotateCW');
  if (rotateCwBtn) rotateCwBtn.onclick = () => rotateLineup('cw');
  const rotateCcwBtn = document.getElementById('rotateCCW');
  if (rotateCcwBtn) rotateCcwBtn.onclick = () => rotateLineup('ccw');
  document.querySelectorAll('.tab-button').forEach(button => {
    button.onclick = () => {
      // Uppdatera active tab
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      
      // Byt set
      currentSet = parseInt(button.dataset.set);
      // Säkra åtkomst till DOM-element – de kan saknas beroende på vy
      const currentSetEl = document.getElementById('currentSetNumber');
      if (currentSetEl) currentSetEl.textContent = currentSet;
      const saveSetEl = document.getElementById('saveSetNumber');
      if (saveSetEl) saveSetEl.textContent = currentSet;
      
      // Ladda uppställning
      loadLineup(currentSet);
      console.log('Bytte till Set', currentSet);
    };
  });
  
  // Event listeners för position changes
  document.querySelectorAll('.position-select').forEach(select => {
    select.onchange = () => {
      updateLineupStatus();
      updateAvailablePlayers();
    };
  });
  document.getElementById('libero1Select').onchange = () => {
    updateLineupStatus();
    updateAvailablePlayers();
  };
  document.getElementById('libero2Select').onchange = () => {
    updateLineupStatus();
    updateAvailablePlayers();
  };
  
  // Event listeners för actions
  document.getElementById('saveLineup').onclick = async () => {
    const positions = {};
    document.querySelectorAll('.position-select').forEach(select => {
      if (select.value) {
        positions[select.dataset.position] = select.value;
      }
    });
    
    const libero1 = document.getElementById('libero1Select').value;
    const libero2 = document.getElementById('libero2Select').value;
    const lineupData = {
      positions,
      libero1: libero1 || null,
      libero2: libero2 || null,
      timestamp: Date.now()
    };
    
    // Uppdatera lokala data
    currentLineups[`set${currentSet}`] = lineupData;
    
    // Visa sparningsmeddelande
    const saveButton = document.getElementById('saveLineup');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Sparar...';
    saveButton.disabled = true;
    
    try {
      // Spara bara det aktuella settet istället för alla
      await saveCurrentSet(currentLineups[`set${currentSet}`]);
      
      // Visa framgångsmeddelande
      saveButton.textContent = 'Sparat ✓';
      saveButton.style.backgroundColor = '#28a745';
      
      // Återställ knappen efter 2 sekunder
      setTimeout(() => {
        saveButton.textContent = originalText;
        saveButton.style.backgroundColor = '';
        saveButton.disabled = false;
      }, 2000);
      
      // Uppdatera status
      updateLineupStatus();
      
    } catch (error) {
      // Visa felmeddelande
      saveButton.textContent = 'Fel vid sparande';
      saveButton.style.backgroundColor = '#dc3545';
      
      setTimeout(() => {
        saveButton.textContent = originalText;
        saveButton.style.backgroundColor = '';
        saveButton.disabled = false;
      }, 3000);
      
      console.error('Fel vid sparande av uppställning:', error);
    }
  };
  
  document.getElementById('copyFromPrevious').onclick = () => {
    if (currentSet > 1) {
      const previousLineup = currentLineups[`set${currentSet - 1}`];
      if (previousLineup) {
        currentLineups[`set${currentSet}`] = {...previousLineup, timestamp: Date.now()};
        loadLineup(currentSet);
      } else {
        alert(`Ingen uppställning finns för Set ${currentSet - 1}`);
      }
    } else {
      alert('Det finns inget föregående set att kopiera från');
    }
  };
  
  document.getElementById('clearLineup').onclick = () => {
    if (confirm(`Är du säker på att du vill rensa uppställningen för Set ${currentSet}?`)) {
      delete currentLineups[`set${currentSet}`];
      loadLineup(currentSet);
    }
  };
  
  document.getElementById('backToMatch').onclick = onBack;
  
  // Populera libero dropdown
  function populateLiberoSelect() {
    const liberoSelect = document.getElementById('liberoSelect');
    const liberoPlayers = playersByPosition['Libero'] || [];
    const otherPlayers = availablePlayers.filter(([id, p]) => p.position !== 'Libero');
    
    let optionsHTML = '<option value="">Välj libero...</option>';
    
    // Lägg till libero-spelare först
    if (liberoPlayers.length > 0) {
      optionsHTML += '<optgroup label="Libero">';
      liberoPlayers.forEach(([id, p]) => {
        optionsHTML += `<option value="${id}">${p.name} (#${p.number || '?'})</option>`;
      });
      optionsHTML += '</optgroup>';
    }
    
    // Lägg till andra spelare som backup
    if (otherPlayers.length > 0) {
      optionsHTML += '<optgroup label="Andra spelare">';
      otherPlayers.forEach(([id, p]) => {
        optionsHTML += `<option value="${id}">${p.name} (#${p.number || '?'}) - ${p.position || 'Okänd position'}</option>`;
      });
      optionsHTML += '</optgroup>';
    }
    
    liberoSelect.innerHTML = optionsHTML;
  }
  
  // Funktion för att spara aktuellt set
  async function saveCurrentSet(lineupData) {
    // Detta kommer att anropas från main.js
    if (window.saveCurrentSetData) {
      await window.saveCurrentSetData(currentSet, lineupData);
    }
  }
  
  // Initial setup - populera dropdowns när sidan laddas
  updateAvailablePlayers();
  loadLineup(currentSet);
}
