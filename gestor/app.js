const supabaseUrl = 'https://cdrubcjbbpcywrppkyma.supabase.co';
const supabaseKey = 'sb_publishable_iYZT4fhgUBGuCDIQ56Zhjw_smcwJG3b';
const db = window.supabase.createClient(supabaseUrl, supabaseKey);

const { createApp, ref, computed, onMounted } = Vue;

const app = createApp({
    setup() {
        const usuariAutenticat = ref(false);
        const correu = ref(''); const contrasenya = ref(''); const errorLogin = ref('');
        const vistaActual = ref('tauler'); const modeHorari = ref('mestre');
        
        const dataSeleccionada = ref(new Date().toISOString().split('T')[0]);
        const mesActual = ref(new Date().getMonth());
        const anyActual = ref(new Date().getFullYear());
        
        const nomsDiesSetmana = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];
        const diesSetmana = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'];
        const categoriesDocents = ['EI', 'CI', 'CM', 'CS', 'SIEI', 'Especialistes', 'Equip Directiu', 'Altres'];

        const docents = ref([]);
        const horariEscola = ref([]);
        const assignacionsHorari = ref([]);
        const llistaAbsencies = ref([]); 
        const grupsTots = ref([]); 
        const absenciesMes = ref([]); 

        const novaAbsencia = ref({ docent_id: '', franges: [] });
        const assignacioEnCurs = ref({ absenciaId: null, durada: null, substitut: '' });
        
        const mestreSeleccionatHorari = ref(''); 
        const mestreAClonar = ref('');
        const grupSeleccionatHorari = ref(''); 
        const textGraellaWord = ref(''); 
        const geminiApiKey = ref('');
        const apiGeminiConfigurada = computed(() => geminiApiKey.value.trim().length > 10);
        const carregantIA = ref(false);
        
        const novaCategoriaMestre = ref('EI');
        const nouMestreNom = ref('');
        const mestreEditat = ref(null);
        const nouGrupNom = ref('');
        const grupEditat = ref(null);
        const nouBlocNom = ref('');
        const nouBlocMinuts = ref('60');

        const dataAvui = new Date().toLocaleDateString('ca-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
        
        const nomDiaSetmanaSeleccionat = computed(() => {
            const d = new Date(dataSeleccionada.value);
            return nomsDiesSetmana[d.getDay()];
        });

        const dataSeleccionadaFormatada = computed(() => {
            const d = new Date(dataSeleccionada.value);
            return d.toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        });

        const nomMesActual = computed(() => {
            const mesos = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
            return mesos[mesActual.value];
        });

        const espaisBuitsCalendari = computed(() => {
            const primerDia = new Date(anyActual.value, mesActual.value, 1).getDay();
            return primerDia === 0 ? 6 : primerDia - 1; 
        });

        const diesDelMes = computed(() => {
            const dies = [];
            const darrerDia = new Date(anyActual.value, mesActual.value + 1, 0).getDate();
            const avuiStr = new Date().toISOString().split('T')[0];
            
            for(let i = 1; i <= darrerDia; i++) {
                const dataStr = `${anyActual.value}-${String(mesActual.value + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                const teAbs = absenciesMes.value.some(a => a.data === dataStr);
                dies.push({ numero: i, data: dataStr, esAvui: dataStr === avuiStr, teAbsencies: teAbs });
            }
            return dies;
        });

        const canviarMes = async (increment) => {
            let nouMes = mesActual.value + increment;
            if(nouMes > 11) { nouMes = 0; anyActual.value++; }
            else if(nouMes < 0) { nouMes = 11; anyActual.value--; }
            mesActual.value = nouMes;
            await carregarAbsenciesMes();
        };

        const seleccionarData = async (dataStr) => {
            dataSeleccionada.value = dataStr;
            await carregarAbsenciesDia();
        };

        const llistaGrupsDinamica = computed(() => {
            const grupsBase = grupsTots.value.map(g => g.nom);
            const totsElsGrupsTasca = assignacionsHorari.value.map(a => a.grup).filter(g => g !== '');
            return [...new Set([...grupsBase, ...totsElsGrupsTasca])].sort();
        });

        const docentsAgrupats = computed(() => {
            const agrupats = {};
            categoriesDocents.forEach(c => agrupats[c] = []);
            agrupats['Sense categoria'] = [];
            docents.value.forEach(d => {
                const cat = d.categoria || 'Sense categoria';
                if(!agrupats[cat]) agrupats[cat] = [];
                agrupats[cat].push(d);
            });
            for(let cat in agrupats) { if(agrupats[cat].length === 0) delete agrupats[cat]; }
            return agrupats;
        });

        const carregarDadesBase = async () => {
            const [resDocents, resBlocs, resAssignacions, resGrups, resConfig] = await Promise.all([
                db.from('docents').select('*').order('nom'),
                db.from('blocs').select('*').order('ordre'),
                db.from('assignacions').select('*'),
                db.from('grups').select('*').order('ordre'),
                db.from('configuracio').select('*').eq('clau', 'gemini_api_key')
            ]);
            
            if(resDocents.data) docents.value = resDocents.data;
            if(resBlocs.data) horariEscola.value = resBlocs.data;
            if(resAssignacions.data) assignacionsHorari.value = resAssignacions.data;
            if(resGrups.data) grupsTots.value = resGrups.data;
            if(resConfig.data && resConfig.data.length > 0) geminiApiKey.value = resConfig.data[0].valor;

            await carregarAbsenciesMes();
            await carregarAbsenciesDia();
        };

        const carregarAbsenciesMes = async () => {
            const inici = `${anyActual.value}-${String(mesActual.value + 1).padStart(2, '0')}-01`;
            const fi = `${anyActual.value}-${String(mesActual.value + 1).padStart(2, '0')}-31`;
            const { data } = await db.from('absencies').select('data').gte('data', inici).lte('data', fi);
            if (data) absenciesMes.value = data;
        };

        const carregarAbsenciesDia = async () => {
            const { data } = await db.from('absencies').select('*').eq('data', dataSeleccionada.value);
            if (data) {
                llistaAbsencies.value = data.map(a => {
                    const d = docents.value.find(x => x.id === a.docent_id);
                    const b = horariEscola.value.find(x => x.id === a.bloc_id);
                    return {
                        id: a.id, docent_id: a.docent_id, nomDocent: d ? d.nom : 'Desconegut',
                        bloc_id: a.bloc_id, blocNom: b ? b.nom : 'Desconegut',
                        minuts_pendents: a.minuts_pendents, assignacions: a.assignacions || []
                    };
                });
            }
        };

        onMounted(async () => {
            const { data: { session } } = await db.auth.getSession();
            if (session) { usuariAutenticat.value = true; correu.value = session.user.email; await carregarDadesBase(); }
        });

        const iniciarSessio = async () => {
            errorLogin.value = '';
            if(!correu.value || !contrasenya.value) { errorLogin.value = "Cal omplir els camps."; return; }
            const { error } = await db.auth.signInWithPassword({ email: correu.value, password: contrasenya.value });
            if (error) { errorLogin.value = "Credencials incorrectes."; } 
            else { usuariAutenticat.value = true; await carregarDadesBase(); }
        };
        const tancarSessio = async () => { await db.auth.signOut(); usuariAutenticat.value = false; };

        const guardarApiKey = async () => {
            const { error } = await db.from('configuracio').upsert({ clau: 'gemini_api_key', valor: geminiApiKey.value });
            if(error) alert("Error desant la clau: " + error.message);
            else alert("✅ Clau de Gemini desada de forma segura a Supabase.");
        };

        // CONNEXIÓ AVANÇADA AMB GEMINI 1.5 FLASH (MODE JSON STRICT)
        const processarAmbGemini = async () => {
            if(!geminiApiKey.value) return alert("Falta la clau API.");
            carregantIA.value = true;
            
            try {
                const blocsDisponibles = horariEscola.value.map(b => b.nom).join(', ');
                const prompt = `Analitza aquest text copiat d'una taula de Word i extreu-ne un calendari escolar.
IMPORTANTÍSSIM: Retorna EXACTAMENT un array JSON pur.
Cada objecte de l'array ha de tenir:
- "dia": Un d'aquests (Dilluns, Dimarts, Dimecres, Dijous, Divendres). Dedueix-ho per la columna si cal.
- "bloc_horari": Tria EXACTAMENT UN d'aquests valors literalment: [${blocsDisponibles}]. Relaciona les hores del text amb el bloc que quadri millor per números.
- "grup": El contingut sencer de la cel·la (ex: "MATEMÀTIQUES" o "LLENGUA"). Si té salts de línia fusiona'ls en un sol text.
- "es_comodi": true si és comodí, guàrdia o suport, sinó false.
(Si la classe dura més d'un bloc, crea un objecte diferent per cada bloc que ocupi. Ignora les hores de DINAR si no tenen text especial).

Text a analitzar:
${textGraellaWord.value}`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.value}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: "application/json" } 
                    })
                });
                
                const result = await response.json();
                if(result.error) throw new Error(result.error.message);
                
                const textJson = result.candidates[0].content.parts[0].text;
                const llistaIA = JSON.parse(textJson);

                const nousRegistres = [];
                for(let casella of llistaIA) {
                    const blocMatch = horariEscola.value.find(b => b.nom === casella.bloc_horari);
                    if(blocMatch && diesSetmana.includes(casella.dia)) {
                        nousRegistres.push({
                            docent_id: mestreSeleccionatHorari.value,
                            dia: casella.dia,
                            bloc_id: blocMatch.id,
                            grup: casella.grup,
                            materia: '',
                            disponible: casella.es_comodi
                        });
                    }
                }

                if(nousRegistres.length > 0) {
                    const actuals = assignacionsHorari.value.filter(a => a.docent_id === mestreSeleccionatHorari.value);
                    for(let a of actuals) { await db.from('assignacions').delete().eq('id', a.id); }

                    const { data, error } = await db.from('assignacions').insert(nousRegistres).select();
                    if(error) throw error;

                    assignacionsHorari.value = assignacionsHorari.value.filter(a => a.docent_id !== mestreSeleccionatHorari.value);
                    assignacionsHorari.value.push(...data);
                    alert(`🤖 Màgia completada! La IA ha desxifrat i col·locat ${nousRegistres.length} franges horàries directament a la graella.`);
                    textGraellaWord.value = '';
                } else {
                    alert("⚠️ Gemini no ha pogut relacionar correctament les hores amb les de la pestanya de 'Configuració'.");
                }
            } catch(e) {
                alert("S'ha produït un error processant amb la IA: " + e.message);
            } finally {
                carregantIA.value = false;
            }
        };

        const getAssignacio = (docentId, dia, blocId) => {
            const as = assignacionsHorari.value.find(a => a.docent_id === docentId && a.dia === dia && a.bloc_id === blocId);
            return as ? as : { grup: '', materia: '', disponible: false };
        };

        const updateAssignacio = async (docentId, dia, blocId, camp, valor) => {
            let asigIndex = assignacionsHorari.value.findIndex(a => a.docent_id === docentId && a.dia === dia && a.bloc_id === blocId);
            if (asigIndex !== -1) {
                let actual = assignacionsHorari.value[asigIndex]; actual[camp] = valor; 
                if (actual.grup === '' && actual.materia.trim() === '' && actual.disponible === false) {
                    const { error } = await db.from('assignacions').delete().eq('id', actual.id);
                    if (!error) assignacionsHorari.value.splice(asigIndex, 1);
                } else {
                    await db.from('assignacions').update({ [camp]: valor }).eq('id', actual.id);
                }
            } else {
                let payload = { docent_id: docentId, dia: dia, bloc_id: blocId, grup: '', materia: '', disponible: false };
                payload[camp] = valor;
                const { data } = await db.from('assignacions').insert(payload).select();
                if (data && data.length > 0) assignacionsHorari.value.push(data[0]);
            }
        };

        const clonarHorari = async () => {
            if(!mestreAClonar.value) return;
            if(!confirm("⚠️ Això sobreescriurà l'horari d'aquest mestre. N'estàs segur/a?")) return;
            const assignacionsActuals = assignacionsHorari.value.filter(a => a.docent_id === mestreSeleccionatHorari.value);
            for(let a of assignacionsActuals) { await db.from('assignacions').delete().eq('id', a.id); }
            assignacionsHorari.value = assignacionsHorari.value.filter(a => a.docent_id !== mestreSeleccionatHorari.value);

            const perClonar = assignacionsHorari.value.filter(a => a.docent_id === mestreAClonar.value);
            const nousRegistres = perClonar.map(a => ({ docent_id: mestreSeleccionatHorari.value, dia: a.dia, bloc_id: a.bloc_id, grup: a.grup, materia: a.materia, disponible: a.disponible }));

            if(nousRegistres.length > 0) {
                const { data, error } = await db.from('assignacions').insert(nousRegistres).select();
                if (error) alert("Error clonant: " + error.message);
                else { assignacionsHorari.value.push(...data); alert("✅ Horari clonat correctament!"); }
            } else { alert("El mestre que has triat no té horari."); }
            mestreAClonar.value = '';
        };

        const getAssignacionsGrup = (grupId, dia, blocId) => { return assignacionsHorari.value.filter(a => a.grup === grupId && a.dia === dia && a.bloc_id === blocId); };

        const afegirMestre = async () => {
            if(nouMestreNom.value.trim()) {
                const { data, error } = await db.from('docents').insert({ nom: nouMestreNom.value.trim(), categoria: novaCategoriaMestre.value }).select();
                if (!error && data) { docents.value.push(data[0]); nouMestreNom.value = ''; }
            }
        };
        const iniciarEdicioMestre = (mestre) => { mestreEditat.value = { ...mestre }; };
        const guardarEdicioMestre = async () => {
            const { error } = await db.from('docents').update({ nom: mestreEditat.value.nom, categoria: mestreEditat.value.categoria }).eq('id', mestreEditat.value.id);
            if(!error) {
                const idx = docents.value.findIndex(d => d.id === mestreEditat.value.id);
                docents.value[idx].nom = mestreEditat.value.nom; docents.value[idx].categoria = mestreEditat.value.categoria;
                mestreEditat.value = null;
            }
        };
        const esborrarMestre = async (index) => {
            if(confirm("Eliminar mestre i tot el seu horari?")) {
                const idEsborrar = docents.value[index].id;
                await db.from('docents').delete().eq('id', idEsborrar);
                assignacionsHorari.value = assignacionsHorari.value.filter(a => a.docent_id !== idEsborrar);
                docents.value.splice(index, 1);
            }
        };

        const afegirGrup = async () => {
            if(nouGrupNom.value.trim()) {
                const ordreCalculat = grupsTots.value.length + 1;
                const { data } = await db.from('grups').insert({ nom: nouGrupNom.value.trim(), ordre: ordreCalculat }).select();
                if(data && data.length > 0) { grupsTots.value.push(data[0]); nouGrupNom.value = ''; }
            }
        };
        const iniciarEdicioGrup = (grup) => { grupEditat.value = { id: grup.id, nom: grup.nom, nomAntic: grup.nom }; };
        const guardarEdicioGrup = async () => {
            const { error } = await db.from('grups').update({ nom: grupEditat.value.nom }).eq('id', grupEditat.value.id);
            if(!error) {
                const idx = grupsTots.value.findIndex(g => g.id === grupEditat.value.id);
                grupsTots.value[idx].nom = grupEditat.value.nom;
                await db.from('assignacions').update({ grup: grupEditat.value.nom }).eq('grup', grupEditat.value.nomAntic);
                assignacionsHorari.value.forEach(a => { if(a.grup === grupEditat.value.nomAntic) a.grup = grupEditat.value.nom; });
                grupEditat.value = null;
            }
        };
        const esborrarGrup = async (index) => {
            if(confirm("Eliminar aquesta classe?")) {
                const idEsborrar = grupsTots.value[index].id;
                await db.from('grups').delete().eq('id', idEsborrar);
                grupsTots.value.splice(index, 1);
            }
        };

        const afegirBloc = async () => {
            if(nouBlocNom.value.trim()) {
                const minuts = parseInt(nouBlocMinuts.value); const ordreCalculat = horariEscola.value.length + 1;
                const { data } = await db.from('blocs').insert({ nom: nouBlocNom.value.trim(), minuts_totals: minuts, ordre: ordreCalculat }).select();
                if(data && data.length > 0) { horariEscola.value.push(data[0]); nouBlocNom.value = ''; nouBlocMinuts.value = '60'; }
            }
        };
        const esborrarBloc = async (index) => {
            if(confirm("Eliminar aquesta franja horària?")) {
                const idEsborrar = horariEscola.value[index].id;
                await db.from('blocs').delete().eq('id', idEsborrar);
                assignacionsHorari.value = assignacionsHorari.value.filter(a => a.bloc_id !== idEsborrar);
                horariEscola.value.splice(index, 1);
            }
        };

        const minutsPendentsTotals = computed(() => { let t = 0; llistaAbsencies.value.forEach(a => { t += a.minuts_pendents; }); return t; });
        const obtenirNomDocent = (id) => { const d = docents.value.find(x => x.id === id); return d ? d.nom : 'Desconegut'; };
        const obtenirNomBloc = (id) => { const b = horariEscola.value.find(x => x.id === id); return b ? b.nom : 'Desconegut'; };
        
        const mestresDisponiblesDiaActual = (blocId) => {
            const nomDia = nomsDiesSetmana[new Date(dataSeleccionada.value).getDay()];
            if(!diesSetmana.includes(nomDia)) return [];
            return assignacionsHorari.value.filter(a => a.dia === nomDia && a.bloc_id === blocId && a.disponible === true);
        };

        const registrarAbsencia = async () => {
            if(!novaAbsencia.value.docent_id || novaAbsencia.value.franges.length === 0) return;
            
            const nousRegistres = novaAbsencia.value.franges.map(b => ({
                docent_id: novaAbsencia.value.docent_id, data: dataSeleccionada.value, bloc_id: b.id,
                minuts_totals: b.minuts_totals, minuts_pendents: b.minuts_totals, assignacions: []
            }));

            const { error } = await db.from('absencies').insert(nousRegistres);
            if (!error) {
                await carregarAbsenciesMes(); 
                await carregarAbsenciesDia(); 
                novaAbsencia.value = { docent_id: '', franges: [] };
            }
        };

        const eliminarAbsencia = async (idAbsencia) => { 
            const { error } = await db.from('absencies').delete().eq('id', idAbsencia);
            if(!error) { await carregarAbsenciesMes(); await carregarAbsenciesDia(); }
        };

        const opcionsDurada = (max) => { const ops = []; for(let i=15; i<=max; i+=15) ops.push(i); return ops; };
        const prepararNovaAssignacio = (abs) => { assignacioEnCurs.value = { absenciaId: abs.id, durada: abs.minuts_pendents, substitut: '' }; };
        
        const confirmarAssignacio = async () => {
            if(!assignacioEnCurs.value.substitut || !assignacioEnCurs.value.durada) return;
            const abs = llistaAbsencies.value.find(a => a.id === assignacioEnCurs.value.absenciaId); 
            const temps = parseInt(assignacioEnCurs.value.durada);
            
            const novesAssignacions = [...abs.assignacions, { durada: temps, substitutId: assignacioEnCurs.value.substitut.id, nomSubstitut: assignacioEnCurs.value.substitut.nom }];
            const nousMinutsPendents = abs.minuts_pendents - temps;

            const { error } = await db.from('absencies').update({ assignacions: novesAssignacions, minuts_pendents: nousMinutsPendents }).eq('id', abs.id);
            if(!error) {
                abs.assignacions = novesAssignacions; abs.minuts_pendents = nousMinutsPendents;
                assignacioEnCurs.value = { absenciaId: null, durada: null, substitut: '' };
            }
        };

        const esborrarAssignacio = async (abs, indexAssignacio) => { 
            const minutsRecuperats = abs.assignacions[indexAssignacio].durada;
            const novesAssignacions = [...abs.assignacions];
            novesAssignacions.splice(indexAssignacio, 1);
            const nousMinutsPendents = abs.minuts_pendents + minutsRecuperats;

            const { error } = await db.from('absencies').update({ assignacions: novesAssignacions, minuts_pendents: nousMinutsPendents }).eq('id', abs.id);
            if(!error) { abs.assignacions = novesAssignacions; abs.minuts_pendents = nousMinutsPendents; }
        };

        return { 
            usuariAutenticat, correu, contrasenya, errorLogin, vistaActual, modeHorari, 
            dataAvui, nomDiaAvui, docents, docentsAgrupats, categoriesDocents, novaCategoriaMestre, mestreEditat,
            horariEscola, diesSetmana, grupsTots, llistaGrupsDinamica, grupEditat, textGraellaWord,
            mestreSeleccionatHorari, mestreAClonar, grupSeleccionatHorari, novaAbsencia, llistaAbsencies, 
            minutsPendentsTotals, assignacioEnCurs, nouMestreNom, nouGrupNom, nouBlocNom, nouBlocMinuts,
            dataSeleccionada, mesActual, anyActual, nomMesActual, diesDelMes, espaisBuitsCalendari, 
            nomDiaSetmanaSeleccionat, dataSeleccionadaFormatada, canviarMes, seleccionarData,
            geminiApiKey, apiGeminiConfigurada, carregantIA, processarAmbGemini, guardarApiKey,
            iniciarSessio, tancarSessio, getAssignacio, updateAssignacio, clonarHorari, getAssignacionsGrup,
            mestresDisponiblesDiaActual, obtenirNomDocent, obtenirNomBloc, registrarAbsencia, eliminarAbsencia, prepararNovaAssignacio, 
            confirmarAssignacio, esborrarAssignacio, opcionsDurada, afegirMestre, iniciarEdicioMestre, guardarEdicioMestre, esborrarMestre,
            afegirGrup, iniciarEdicioGrup, guardarEdicioGrup, esborrarGrup, afegirBloc, esborrarBloc
        }
    }
});

app.config.errorHandler = (err) => {
    document.body.innerHTML = `
        <div style="max-width:600px; margin:50px auto; background:#fee2e2; border:2px solid #ef4444; padding:20px; border-radius:8px; color:#991b1b; font-family:sans-serif;">
            <h2 style="font-size:1.5rem; font-weight:bold; margin-bottom:10px;">🚨 S'ha detectat un error a Vue (app.js)</h2>
            <div style="background:white; padding:10px; margin-top:10px; font-family:monospace; border:1px solid #fca5a5;">${err.message}</div>
        </div>`;
};

app.mount('#app');
