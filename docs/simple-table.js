// Multi-Table Audio Constructor
// Configure different IR examples for each table by editing the tableConfigs object below

// Global variables to store CSV data
let csvData = null;
let finsErrorData = null;
let finsLayernormErrorData = null;
let finsLayernorm2chErrorData = null;
let genchoErrorData = null;
let gencho2chErrorData = null;

// Function to load CSV data
async function loadCSVData() {
    try {
        const response = await fetch('source/audio/gt/gsX/eval_metrics_target_stats_outofdomain.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        csvData = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                const row = {};
                headers.forEach((header, index) => {
                    row[header.trim()] = values[index] ? values[index].trim() : '';
                });
                csvData.push(row);
            }
        }
    } catch (error) {
        console.error('Error loading CSV data:', error);
        csvData = [];
    }
}

// Function to get T60 and DRR values for a given IR filename
function getT60AndDRR(irFilename) {
    if (!csvData) return { t60: 'N/A', drr: 'N/A' };
    
    // Find the row that matches the IR filename (without the speech file part)
    const baseFilename = irFilename.split('+')[0]; // Remove speech file part if present
    
    for (const row of csvData) {
        if (row.sample_id && row.sample_id.includes(baseFilename)) {
            return {
                t60: parseFloat(row.rt_fullband).toFixed(2),
                drr: parseFloat(row.drr).toFixed(2)
            };
        }
    }
    
    return { t60: 'N/A', drr: 'N/A' };
}

// Function to load error metrics CSV data
async function loadErrorMetricsData() {
    try {
        // Load FiNS error data
        const finsResponse = await fetch('source/audio/fins/gsX/eval_metrics/eval_metrics_outofdomain_20251029.csv');
        const finsText = await finsResponse.text();
        finsErrorData = parseCSVData(finsText);
        
        // Load FiNS+LN error data
        const finsLayernormResponse = await fetch('source/audio/fins-layernorm/gsX/eval_metrics/eval_metrics_outofdomain_20251029.csv');
        const finsLayernormText = await finsLayernormResponse.text();
        finsLayernormErrorData = parseCSVData(finsLayernormText);
        
        // Load FiNS+LN+AS error data
        const finsLayernorm2chResponse = await fetch('source/audio/fins-layernorm-2ch/gsX/eval_metrics/eval_metrics_outofdomain_20251029.csv');
        const finsLayernorm2chText = await finsLayernorm2chResponse.text();
        finsLayernorm2chErrorData = parseCSVData(finsLayernorm2chText);
        
        // Load Gencho error data
        const genchoResponse = await fetch('source/audio/gencho/gs3/eval_metrics/eval_metrics_outofdomain_20251029.csv');
        const genchoText = await genchoResponse.text();
        genchoErrorData = parseCSVData(genchoText);
        
        // Load Gencho+AS error data
        const gencho2chResponse = await fetch('source/audio/gencho-2ch/gs3/eval_metrics/eval_metrics_outofdomain_20251029.csv');
        const gencho2chText = await gencho2chResponse.text();
        gencho2chErrorData = parseCSVData(gencho2chText);
        
    } catch (error) {
        console.error('Error loading error metrics data:', error);
        finsErrorData = [];
        finsLayernormErrorData = [];
        finsLayernorm2chErrorData = [];
        genchoErrorData = [];
        gencho2chErrorData = [];
    }
}

// Helper function to parse CSV data
function parseCSVData(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            data.push(row);
        }
    }
    return data;
}

// Function to get T60 and DRR values with error metrics for FiNS variants
function getT60AndDRRWithErrors(irFilename, variant) {
    let errorData = null;
    
    switch (variant) {
        case 'fins':
            errorData = finsErrorData;
            break;
        case 'fins-layernorm':
            errorData = finsLayernormErrorData;
            break;
        case 'fins-layernorm-2ch':
            errorData = finsLayernorm2chErrorData;
            break;
        default:
            return { t60: 'N/A', drr: 'N/A', t60Error: 'N/A', drrError: 'N/A' };
    }
    
    if (!errorData) return { t60: 'N/A', drr: 'N/A', t60Error: 'N/A', drrError: 'N/A' };
    
    // Find the row that matches the IR filename
    const baseFilename = irFilename.split('+')[0]; // Remove speech file part if present
    
    for (const row of errorData) {
        if (row.sample_id && row.sample_id.includes(baseFilename)) {
            return {
                t60: parseFloat(row['rt_fullband']).toFixed(2),
                drr: parseFloat(row['drr']).toFixed(2),
                t60Error: (parseFloat(row['irstats/rt_pae']) * 100).toFixed(1),
                drrError: parseFloat(row['irstats/drr_mae']).toFixed(2)
            };
        }
    }
    
    return { t60: 'N/A', drr: 'N/A', t60Error: 'N/A', drrError: 'N/A' };
}

// Function to get T60 and DRR values with error metrics for Gencho variants
function getGenchoT60AndDRRWithErrors(irFilename, variant, genchoVersion) {
    let errorData = null;
    
    switch (variant) {
        case 'gencho':
            errorData = genchoErrorData;
            break;
        case 'gencho-2ch':
            errorData = gencho2chErrorData;
            break;
        default:
            return { t60: 'N/A', drr: 'N/A', t60Error: 'N/A', drrError: 'N/A' };
    }
    
    if (!errorData) return { t60: 'N/A', drr: 'N/A', t60Error: 'N/A', drrError: 'N/A' };
    
    // Find the row that matches the IR filename and version
    const baseFilename = irFilename.split('+')[0]; // Remove speech file part if present
    const versionPrefix = genchoVersion.replace('_normalized', ''); // Convert gs3_1_normalized to gs3_1
    
    for (const row of errorData) {
        if (row.sample_id && row.sample_id.includes(versionPrefix) && row.sample_id.includes(baseFilename)) {
            return {
                t60: parseFloat(row.rt_fullband).toFixed(2),
                drr: parseFloat(row.drr).toFixed(2),
                t60Error: (parseFloat(row['irstats/rt_pae']) * 100).toFixed(1),
                drrError: parseFloat(row['irstats/drr_mae']).toFixed(2)
            };
        }
    }
    
    return { t60: 'N/A', drr: 'N/A', t60Error: 'N/A', drrError: 'N/A' };
}

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
                
                // Add T60 and DRR values below the audio
                const metrics = getT60AndDRR(ir.filename);
                const metricsDiv = document.createElement('div');
                metricsDiv.style.marginTop = '8px';
                metricsDiv.style.fontSize = '0.8em';
                metricsDiv.style.color = '#666';
                metricsDiv.innerHTML = `T60: ${metrics.t60}s <br>DRR: ${metrics.drr}dB`;
                targetCell.appendChild(metricsDiv);
                
                row.appendChild(targetCell);
                
                // FiNS variants
                const finsPaths = [
                    { path: 'fins/gsX/outofdomain/gsX_1_normalized', variant: 'fins' },
                    { path: 'fins-layernorm/gsX/outofdomain/gsX_1_normalized', variant: 'fins-layernorm' },
                    { path: 'fins-layernorm-2ch/gsX/outofdomain/gsX_1_normalized', variant: 'fins-layernorm-2ch' }
                ];
                
                finsPaths.forEach(({ path, variant }) => {
                    const cell = document.createElement('td');
                    cell.appendChild(createAudio(`source/audio/${path}/${ir.filename}.wav`));
                    
                    // Add T60 and DRR values with error metrics below the audio
                    const metrics = getT60AndDRRWithErrors(ir.filename, variant);
                    const metricsDiv = document.createElement('div');
                    metricsDiv.style.marginTop = '8px';
                    metricsDiv.style.fontSize = '0.8em';
                    metricsDiv.style.color = '#666';
                    metricsDiv.innerHTML = `T60: ${metrics.t60} Error: ${metrics.t60Error}%<br>DRR: ${metrics.drr} Error: ${metrics.drrError}dB`;
                    cell.appendChild(metricsDiv);
                    
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
            
            // Add T60 and DRR values with error metrics below the audio (rows 1, 3, 5)
            if (rowIndex % 2 === 0) {
                const metrics = getGenchoT60AndDRRWithErrors(ir.filename, 'gencho', genchoVersion);
                const metricsDiv = document.createElement('div');
                metricsDiv.style.marginTop = '8px';
                metricsDiv.style.fontSize = '0.8em';
                metricsDiv.style.color = '#666';
                metricsDiv.innerHTML = `T60: ${metrics.t60} Error: ${metrics.t60Error}%<br>DRR: ${metrics.drr} Error: ${metrics.drrError}dB`;
                genchoCell.appendChild(metricsDiv);
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
            
            // Add T60 and DRR values with error metrics below the audio (rows 1, 3, 5)
            if (rowIndex % 2 === 0) {
                const metrics = getGenchoT60AndDRRWithErrors(ir.filename, 'gencho-2ch', genchoVersion);
                const metricsDiv = document.createElement('div');
                metricsDiv.style.marginTop = '8px';
                metricsDiv.style.fontSize = '0.8em';
                metricsDiv.style.color = '#666';
                metricsDiv.innerHTML = `T60: ${metrics.t60} Error: ${metrics.t60Error}%<br>DRR: ${metrics.drr} Error: ${metrics.drrError}dB`;
                gencho2chCell.appendChild(metricsDiv);
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
            const audioPath = `source/audio/mos_samples/${filename}`;
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
document.addEventListener('DOMContentLoaded', async () => {
    await loadCSVData();
    await loadErrorMetricsData();
    buildAllTables();
});
