// Multi-Table Audio Constructor
// Configure different IR examples for each table by editing the tableConfigs object below

// Configuration for each table
const tableConfigs = {
    'rir-generation-table': {
        name: 'RIR Generation',
        irExamples: [
            {
                name: 'Alcuin College',
                filename: 'ir_openair_alcuin_college_university_york__b-format__s2r1_spist_bform'
            },
            {
                name: 'Hotel Skalsky',
                filename: 'ir_butreverbdb_Hotel_SkalskyDvur_Room112-SpkID01_20170906_S-27-RIR-v00'
            },
            {
                name: 'Genesis Studio',
                filename: 'ir_openair_genesis_6_studio_live_room_drum_set__b-format__snare_ir'
            },
            {
                name: 'Central Hall',
                filename: 'ir_openair_central_hall_university_york__b-format__ir_row_3l_centre_mid'
            },
            {
                name: 'Creswell Crags',
                filename: 'ir_openair_creswell_crags__b-format__1_s_mainlevel_r_mainlevel2'
            }
        ]
    },
    'real-world-table': {
        name: 'RIR Generation on real-world recordings',
        irExamples: [
            {
                name: 'Heslington Church',
                filename: 'ir_openair_heslington_church_vaa_group_2__b-format__impulseresponseheslingtonchurch-002'
            },
            {
                name: 'Newgrange',
                filename: 'ir_openair_newgrange__b-format__newgrange_s1r1'
            },
            {
                name: 'York Guildhall',
                filename: 'ir_openair_york_guildhall_council_chamber__b-format__councilchamber_s2_r4_ir_1_96000'
            },
            {
                name: 'Innocent Tunnel',
                filename: 'ir_openair_innocent_railway_tunnel__b-format__tunnel_entrance_b_4way_bformat'
            },
            {
                name: 'Jack Lyons Hall',
                filename: 'ir_openair_jack_lyons_concert_hall_university_york__b-format__rir_jack_lyons_lp4_96k'
            }
        ]
    },
    'text-controllable-table': {
        name: 'Text-Controllable RIR Generation',
        textPrompts: [
            {
                name: 'Example 1',
                drySpeech: 'f4_script1-00031-clean.wav',
                textPrompt: 'A large cathedral with high ceilings and long reverberation',
                irVariations: [
                    'ir_openair_st_georges_episcopal_church__stereo__st_georges_far',
                    'ir_openair_st_margarets_church_national_centre_early_music__b-format__r20_3rd_configuration',
                    'ir_openair_heslington_church_vaa_group_2__b-format__impulseresponseheslingtonchurch-002'
                ]
            },
            {
                name: 'Example 2',
                drySpeech: 'm2_script1-00031-clean.wav',
                textPrompt: 'A small intimate room with short reverberation',
                irVariations: [
                    'ir_butreverbdb_Hotel_SkalskyDvur_Room112-SpkID01_20170906_S-27-RIR-v00',
                    'ir_butreverbdb_VUT_FIT_C236-SpkID08_20190503_S-04-RIR-v00',
                    'ir_butreverbdb_VUT_FIT_L212-SpkID01_20170818_T-30-RIR-v00'
                ]
            },
            {
                name: 'Example 3',
                drySpeech: 'm3_script1-00001+00002-clean.wav',
                textPrompt: 'A concert hall with rich acoustics',
                irVariations: [
                    'ir_openair_jack_lyons_concert_hall_university_york__b-format__rir_jack_lyons_lp4_96k',
                    'ir_openair_usina_del_arte_symphony_hall__stereo__usina_main_s1_p2',
                    'ir_openair_central_hall_university_york__b-format__ir_row_3l_centre_mid'
                ]
            }
        ]
    }
};

// Extract speech file from IR filename by looking for corresponding +speechfile files
function getSpeechFile(irFilename) {
    // Map of IR filenames to their corresponding speech files based on the outofdomain folder
    const irToSpeechMap = {
        'ir_openair_alcuin_college_university_york__b-format__s2r1_spist_bform': 'f4_script1-00031-clean.wav',
        'ir_butreverbdb_Hotel_SkalskyDvur_Room112-SpkID01_20170906_S-27-RIR-v00': 'm2_script1-00031-clean.wav',
        'ir_openair_central_hall_university_york__b-format__ir_row_3l_centre_mid': 'f8_script1-00030-clean.wav',
        'ir_openair_creswell_crags__b-format__1_s_mainlevel_r_mainlevel2': 'm2_script1-00031-clean.wav',
        'ir_openair_genesis_6_studio_live_room_drum_set__b-format__snare_ir': 'f8_script1-00030-clean.wav',
        'ir_openair_heslington_church_vaa_group_2__b-format__impulseresponseheslingtonchurch-002': 'm9_script1-00006-clean.wav',
        'ir_openair_innocent_railway_tunnel__b-format__tunnel_entrance_b_4way_bformat': 'm2_script1-00031-clean.wav',
        'ir_openair_jack_lyons_concert_hall_university_york__b-format__rir_jack_lyons_lp4_96k': 'f3_script1-00032-clean.wav',
        'ir_openair_newgrange__b-format__newgrange_s1r1': 'f7_script1-00015-clean.wav',
        'ir_openair_ron_cooke_hub_university_york__b-format__fstr': 'm2_script1-00031-clean.wav',
        'ir_openair_st_georges_episcopal_church__stereo__st_georges_far': 'f4_script1-00031-clean.wav',
        'ir_openair_spring_lane_building_university_york__stereo__sp2_mp3_ir_stereo_trimmed': 'm3_script1-00001+00002-clean.wav',
        'ir_openair_st_marys_abbey_reconstruction__stereo__phase1_stereo': 'm8_script1-00001+00002-clean.wav',
        'ir_openair_tvisongur_sound_sculpture_iceland_model__stereo__source4domedoreceiver1domefabinaural': 'f8_script1-00030-clean.wav',
        'ir_openair_york_guildhall_council_chamber__b-format__councilchamber_s2_r4_ir_1_96000': 'm10_script1-00022+00023-clean.wav'
    };
    
    // Return the corresponding speech file, or default if not found
    return irToSpeechMap[irFilename] || 'f4_script1-00031-clean.wav';
}

// Create audio element
function createAudio(src) {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.className = 'player';
    
    const source = document.createElement('source');
    source.src = src;
    source.type = 'audio/mpeg';
    
    audio.appendChild(source);
    audio.appendChild(document.createTextNode('Your browser does not support the audio element.'));
    
    return audio;
}

// Build a specific table
function buildTable(tableId) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    const config = tableConfigs[tableId];
    if (!config) return;

    tbody.innerHTML = '';

    // Special handling for text-controllable table
    if (tableId === 'text-controllable-table') {
        buildTextControllableTable(tbody, config);
        return;
    }

    // Regular table building for other tables
    config.irExamples.forEach((ir, index) => {
        const speechFile = getSpeechFile(ir.filename);
        
        // Row 1: IR only
        const irRow = document.createElement('tr');
        
        // IR Name
        const exampleCell = document.createElement('td');
        exampleCell.textContent = ir.name;
        irRow.appendChild(exampleCell);
        
        // Target IR
        const targetCell = document.createElement('td');
        targetCell.appendChild(createAudio(`source/audio/gt/gsX/outofdomain/${ir.filename}.wav`));
        irRow.appendChild(targetCell);
        
        // Model outputs
        const modelPaths = [
            'fins/gsX/outofdomain/gsX_1',
            'fins-layernorm/gsX/outofdomain/gsX_1', 
            'fins-layernorm-2ch/gsX/outofdomain/gsX_1',
            'gencho/gs3/outofdomain/gs3_1',
            'gencho-2ch/gs3/outofdomain/gs3_1'
        ];
        
        modelPaths.forEach(path => {
            const cell = document.createElement('td');
            cell.appendChild(createAudio(`source/audio/${path}/${ir.filename}.wav`));
            irRow.appendChild(cell);
        });
        
        tbody.appendChild(irRow);
        
        // Row 2: Reverberant speech
        const speechRow = document.createElement('tr');
        
        // Dry speech
        const dryCell = document.createElement('td');
        dryCell.appendChild(createAudio(`source/audio/gt/speech/${speechFile}`));
        speechRow.appendChild(dryCell);
        
        // Target reverberant speech
        const targetSpeechCell = document.createElement('td');
        targetSpeechCell.appendChild(createAudio(`source/audio/gt/gsX/outofdomain/${ir.filename}+${speechFile}`));
        speechRow.appendChild(targetSpeechCell);
        
        // Model reverberant speech outputs
        modelPaths.forEach(path => {
            const cell = document.createElement('td');
            cell.appendChild(createAudio(`source/audio/${path}/${ir.filename}+${speechFile}`));
            speechRow.appendChild(cell);
        });
        
        tbody.appendChild(speechRow);
    });
}

// Build text-controllable table with special structure
function buildTextControllableTable(tbody, config) {
    config.textPrompts.forEach((prompt, promptIndex) => {
        // Create 3 rows for each text prompt (one for each IR variation)
        prompt.irVariations.forEach((irFilename, variationIndex) => {
            const row = document.createElement('tr');
            
            // Dry Speech column
            const dryCell = document.createElement('td');
            if (variationIndex === 0) {
                // Only show dry speech in first row of each prompt
                dryCell.appendChild(createAudio(`source/audio/gt/speech/${prompt.drySpeech}`));
                dryCell.rowSpan = prompt.irVariations.length;
            } else {
                // Empty cell for subsequent rows (will be merged)
                dryCell.style.display = 'none';
            }
            row.appendChild(dryCell);
            
            // Text Prompt column
            const textCell = document.createElement('td');
            if (variationIndex === 0) {
                // Only show text prompt in first row of each prompt
                textCell.textContent = prompt.textPrompt;
                textCell.rowSpan = prompt.irVariations.length;
                textCell.style.fontSize = '0.8em';
                textCell.style.maxWidth = '200px';
            } else {
                // Empty cell for subsequent rows (will be merged)
                textCell.style.display = 'none';
            }
            row.appendChild(textCell);
            
            // Gencho IR column
            const irCell = document.createElement('td');
            irCell.appendChild(createAudio(`source/audio/gencho/gs3/outofdomain/gs3_1/${irFilename}.wav`));
            row.appendChild(irCell);
            
            // Gencho Speech column
            const speechCell = document.createElement('td');
            const speechFile = getSpeechFile(irFilename);
            speechCell.appendChild(createAudio(`source/audio/gencho/gs3/outofdomain/gs3_1/${irFilename}+${speechFile}`));
            row.appendChild(speechCell);
            
            tbody.appendChild(row);
        });
    });
}

// Build all tables
function buildAllTables() {
    Object.keys(tableConfigs).forEach(tableId => {
        buildTable(tableId);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', buildAllTables);