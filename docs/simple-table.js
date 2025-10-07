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
                drySpeech: 'm9_script1-00006-clean.wav',
                textPrompt: 'Wide rock canyon with very distinct, but sparse echoes. There is a long time lag between each echo.',
                irVariations: [
                    'ir_canyon_1',
                    'ir_canyon_2',
                    'ir_canyon_3',
                    'ir_canyon_4'
                ]
            },
            {
                name: 'Example 2',
                drySpeech: 'm1_script1-00008-clean.wav',
                textPrompt: 'Fully tiled bathroom with amazing shower acoustics. The talker is very close by, and the bathroom is small. The reverb has a ringing quality with strong resonances.',
                irVariations: [
                    'ir_bathroom_1',
                    'ir_bathroom_2',
                    'ir_bathroom_3',
                    'ir_bathroom_4'
                ]
            },
            {
                name: 'Example 3',
                drySpeech: 'f10_script1-00034-clean.wav',
                textPrompt: 'A long, echoey high school hallway with lockers and linoleum floors. Bright, shiny, share and strong reverb with many high frequency components decaying slowly.',
                irVariations: [
                    'ir_hallway_1',
                    'ir_hallway_2',
                    'ir_hallway_3',
                    'ir_hallway_4',
                ]
            },
            {
                name: 'Example 4',
                drySpeech: 'f2_script1-00015-clean.wav',
                textPrompt: 'Quiet, dry music recording booth. The room is covered with foam wedges and has carpeted floors. It sounds very quet and very dry even if you speak loudly, and thre is absolutely no echo or reverb.',
                irVariations: [
                    'ir_recordingbooth_1',
                    'ir_recordingbooth_2',
                    'ir_recordingbooth_3',
                    'ir_recordingbooth_4',
                ]
            },
            {
                name: 'Example 5',
                drySpeech: 'm2_script1-00031-clean.wav',
                textPrompt: 'Humongous, cavernous cathedral with a thundering and extremely long reverb.',
                irVariations: [
                    'ir_cathedral_1',
                    'ir_cathedral_2',
                    'ir_cathedral_3',
                    'ir_cathedral_4',
                ]
            }
        ]
    },
    'mos-table': {
        name: 'MOS Evaluation Samples',
        examples: [
            {
                name: 'Living Room (iPad)',
                suffix: 'f5-script1-ipad-livingroom1-00027+00028'
            },
            {
                name: 'Office (iPad)',
                suffix: 'f8-script1-ipad-office1-00023+00024'
            },
            {
                name: 'Balcony (iPad)',
                suffix: 'm2-script1-ipad-balcony1-00001+00002'
            },
            {
                name: 'Bedroom (iPhone)',
                suffix: 'm8-script1-iphone-bedroom1-00009+00010'
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
        'ir_openair_heslington_church_vaa_group_2__b-format__impulseresponseheslingtonchurch-002': 'm9_scriptCd00006-clean.wav',
        'ir_openair_innocent_railway_tunnel__b-format__tunnel_entrance_b_4way_bformat': 'm2_script1-00031-clean.wav',
        'ir_openair_jack_lyons_concert_hall_university_york__b-format__rir_jack_lyons_lp4_96k': 'f3_script1-00032-clean.wav',
        'ir_openair_newgrange__b-format__newgrange_s1r1': 'f7_script1-00015-clean.wav',
        'ir_openair_ron_cooke_hub_university_york__b-format__fstr': 'm2_script1-00031-clean.wav',
        'ir_openair_st_georges_episcopal_church__stereo__st_georges_far': 'f4_script1-00031-clean.wav',
        'ir_openair_spring_lane_building_university_york__stereo__sp2_mp3_ir_stereo_trimmed': 'm3_script1-00001+00002-clean.wav',
        'ir_openair_st_marys_abbey_reconstruction__stereo__phase1_stereo': 'm8_script1-00001+00002-clean.wav',
        'ir_openair_tvisongur_sound_sculpture_iceland_model__stereo__source4domedoreceiver1domefabinaural': 'f8_script1-00030-clean.wav',
        'ir_openair_york_guildhall_council_chamber__b-format__councilchamber_s2_r4_ir_1_96000': 'm10_script1-00022+00023-clean.wav',
        'ir_canyon_1': 'm9.wav',
        'ir_canyon_2': 'm9.wav',
        'ir_canyon_3': 'm9.wav',
        'ir_canyon_4': 'm9.wav',
        'ir_bathroom_1': 'm1.wav',
        'ir_bathroom_2': 'm1.wav',
        'ir_bathroom_3': 'm1.wav',
        'ir_bathroom_4': 'm1.wav',
        'ir_hallway_1': 'f10.wav',
        'ir_hallway_2': 'f10.wav',
        'ir_hallway_3': 'f10.wav',
        'ir_hallway_4': 'f10.wav',
        'ir_recordingbooth_1': 'f2.wav',
        'ir_recordingbooth_2': 'f2.wav',
        'ir_recordingbooth_3': 'f2.wav',
        'ir_recordingbooth_4': 'f2.wav',
        'ir_cathedral_1': 'm2.wav',
        'ir_cathedral_2': 'm2.wav',
        'ir_cathedral_3': 'm2.wav',
        'ir_cathedral_4': 'm2.wav',
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

    // Special handling for RIR generation table
    if (tableId === 'rir-generation-table') {
        buildRIRGenerationTable(tbody, config);
        return;
    }

    // if (tableId === 'real-world-table') {
    //     buildRealWorldTable(tbody, config);
    //     return;
    // }

    if (tableId === 'mos-table') {
        buildMOSTable(tbody, config);
        return;
    }
}

// Build real-world table with special 2-row structure
// function buildRealWorldTable(tbody, config) {
//     config.irExamples.forEach((ir, index) => {
//         const speechFile = getSpeechFile(ir.filename);
//         const row = document.createElement('tr');

// Build RIR generation table with special 6-row structure
function buildRIRGenerationTable(tbody, config) {
    config.irExamples.forEach((ir, index) => {
        const speechFile = getSpeechFile(ir.filename);
        
        // Create 6 rows for each IR example
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            const row = document.createElement('tr');
            
            // First 5 columns: Dry Speech, Input & Target, FiNS, FiNS+LN, FiNS+LN+AS
            if (rowIndex === 0) {
                // Row 1: IR only
                // Example name
                const exampleCell = document.createElement('td');
                exampleCell.textContent = ir.name;
                row.appendChild(exampleCell);
                
                // Target IR
                const targetCell = document.createElement('td');
                targetCell.appendChild(createAudio(`source/audio/gt/gsX/outofdomain_normalized/${ir.filename}.wav`));
                row.appendChild(targetCell);
                
                // FiNS variants
                const finsPaths = [
                    'fins/gsX/outofdomain/gsX_1_normalized',
                    'fins-layernorm/gsX/outofdomain/gsX_1_normalized', 
                    'fins-layernorm-2ch/gsX/outofdomain/gsX_1_normalized'
                ];
                
                finsPaths.forEach(path => {
                    const cell = document.createElement('td');
                    cell.appendChild(createAudio(`source/audio/${path}/${ir.filename}.wav`));
                    row.appendChild(cell);
                });
                
            } else if (rowIndex === 1) {
                // Row 2: Reverberant speech
                // Dry speech
                const dryCell = document.createElement('td');
                dryCell.appendChild(createAudio(`source/audio/gt/speech/${speechFile}`));
                row.appendChild(dryCell);
                
                // Target reverberant speech
                const targetSpeechCell = document.createElement('td');
                targetSpeechCell.appendChild(createAudio(`source/audio/gt/gsX/outofdomain_normalized/${ir.filename}+${speechFile}`));
                row.appendChild(targetSpeechCell);
                
                // FiNS reverberant speech
                const finsPaths = [
                    'fins/gsX/outofdomain/gsX_1_normalized',
                    'fins-layernorm/gsX/outofdomain/gsX_1_normalized', 
                    'fins-layernorm-2ch/gsX/outofdomain/gsX_1_normalized'
                ];
                
                finsPaths.forEach(path => {
                    const cell = document.createElement('td');
                    cell.appendChild(createAudio(`source/audio/${path}/${ir.filename}+${speechFile}`));
                    row.appendChild(cell);
                });
                
            } else {
                // Rows 3-6: Empty cells for first 5 columns
                for (let i = 0; i < 5; i++) {
                    const emptyCell = document.createElement('td');
                    emptyCell.innerHTML = '&nbsp;'; // Use non-breaking space instead of hiding
                    row.appendChild(emptyCell);
                }
            }
            
            // Last 2 columns: Gencho and Gencho+AS (all 6 rows)
            const genchoVersions = ['gs3_1_normalized', 'gs3_2_normalized', 'gs3_3_normalized'];
            const genchoVersion = genchoVersions[rowIndex % 3];
            
            // Gencho column (6th column)
            const genchoCell = document.createElement('td');
            const genchoPath = `gencho/gs3/outofdomain/${genchoVersion}`;
            if (rowIndex % 2 === 0) {
                // Even rows (0, 2, 4): IR only
                genchoCell.appendChild(createAudio(`source/audio/${genchoPath}/${ir.filename}.wav`));
            } else {
                // Odd rows (1, 3, 5): Reverberant speech
                genchoCell.appendChild(createAudio(`source/audio/${genchoPath}/${ir.filename}+${speechFile}`));
            }
            row.appendChild(genchoCell);
            
            // Gencho+AS column (7th column)
            const gencho2chCell = document.createElement('td');
            const gencho2chPath = `gencho-2ch/gs3/outofdomain/${genchoVersion}`;
            if (rowIndex % 2 === 0) {
                // Even rows (0, 2, 4): IR only
                gencho2chCell.appendChild(createAudio(`source/audio/${gencho2chPath}/${ir.filename}.wav`));
            } else {
                // Odd rows (1, 3, 5): Reverberant speech
                gencho2chCell.appendChild(createAudio(`source/audio/${gencho2chPath}/${ir.filename}+${speechFile}`));
            }
            row.appendChild(gencho2chCell);
            
            // Add thicker border after the last row of each example (row 5)
            if (rowIndex === 5) {
                row.style.borderBottom = '3px solid #000';
            }
            
            tbody.appendChild(row);
        }
    });
}

// Build text-controllable table with special structure
function buildTextControllableTable(tbody, config) {
    // Set larger font size for the entire table body
    tbody.style.fontSize = '0.9em'; // You can increase this value as needed, e.g., '1.1em' or '16px'
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
                textCell.style.fontSize = '1em'; // Make sure text prompt is not too small
                textCell.style.maxWidth = '200px';
            } else {
                // Empty cell for subsequent rows (will be merged)
                textCell.style.display = 'none';
            }
            row.appendChild(textCell);
            
            // Gencho IR column
            const irCell = document.createElement('td');
            irCell.appendChild(createAudio(`source/audio/text2ir/${irFilename}.wav`));
            row.appendChild(irCell);
            
            // Gencho Speech column
            const speechCell = document.createElement('td');
            const speechFile = getSpeechFile(irFilename);
            speechCell.appendChild(createAudio(`source/audio/text2ir/${irFilename}+${speechFile}`));
            row.appendChild(speechCell);
            
            tbody.appendChild(row);
        });
    });
}
// Build MOS table with organized columns by prefix
function buildMOSTable(tbody, config) {
    config.examples.forEach((example, index) => {
        const row = document.createElement('tr');
        
        // First column: Example name (sideways text)
        const exampleCell = document.createElement('td');
        exampleCell.textContent = example.name;
        // exampleCell.style.writingMode = 'vertical-rl';
        // exampleCell.style.textOrientation = 'mixed';
        exampleCell.style.fontSize = '0.8em';
        exampleCell.style.fontWeight = '600';
        exampleCell.style.color = 'gray';
        row.appendChild(exampleCell);
        
        // Define the column order based on the prefixes
        const columnOrder = [
            'mos_clean',
            'mos_fins-ft', 
            'mos_fins-layernorm',
            'mos_fins-layernorm-2stem',
            'mos_diffusion-1stem',
            'mos_diffusion-2stem',
            'mos_diffusion-2stem-5ms-prompt',
            'mos_mixture'
        ];
        
        // Create cells for each column
        columnOrder.forEach(prefix => {
            const cell = document.createElement('td');
            const filename = `${prefix}_${example.suffix}.mp3`;
            const audioPath = `source/tab_1/mos_samples/${filename}`;
            cell.appendChild(createAudio(audioPath));
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
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
