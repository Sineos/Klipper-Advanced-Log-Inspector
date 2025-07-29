const { useState, useEffect, useRef, useCallback, memo, useMemo } = React;

// ===================================================================
//  1. HELPER COMPONENTS
// ===================================================================

const ThemeSwitcher = memo(({ theme, toggleTheme }) => (
    <div className="theme-switcher">
        <span>☀️</span>
        <label className="switch">
            <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
            <span className="slider"></span>
        </label>
        <span>🌙</span>
    </div>
));

const Header = memo(({ theme, toggleTheme }) => (
    <header className="app-header">
        <div className="header-content">
            <svg className="header-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: 'var(--primary-color)', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor: 'var(--secondary-color)', stopOpacity:1}} />
                    </linearGradient>
                </defs>
                {/* Document shape */}
                <path d="M14,2 L44,2 L58,16 L58,60 L14,60 Z" fill="var(--surface-color)" stroke="var(--text-color)" strokeWidth="2" />
                <path d="M44,2 L44,16 L58,16" fill="var(--surface-color)" stroke="var(--text-color)" strokeWidth="2" />
                {/* Magnifying glass */}
                <circle cx="32" cy="32" r="10" stroke="url(#grad1)" strokeWidth="3" fill="none" />
                <line x1="24" y1="40" x2="18" y2="46" stroke="url(#grad1)" strokeWidth="3" />
                {/* Bar chart inside glass */}
                <rect x="26" y="32" width="3" height="6" fill="var(--text-color)" />
                <rect x="31" y="28" width="3" height="10" fill="var(--text-color)" />
                <rect x="36" y="30" width="3" height="8" fill="var(--text-color)" />
                {/* Alert circle */}
                <circle cx="48" cy="48" r="8" fill="var(--secondary-color)" />
                <text x="48" y="52" textAnchor="middle" fill="#212121" fontSize="12" fontWeight="bold">!</text>
            </svg>
            <div className="header-title">
                <h1>Klipper Advanced Log Inspector</h1>
                <p>Inspect, compare, and diagnose your Klipper logs.</p>
            </div>
        </div>
        <div className="header-controls">
            <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            <a
                href="https://github.com/Sineos/Klipper-Advanced-Log-Inspector"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
                title="View on GitHub"
            >
                <svg height="24" viewBox="0 0 16 16" version="1.1" width="24" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            </a>
        </div>
    </header>
));

// FileUpload
const FileUpload = memo(({ onFileLoaded, loading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);
    const handleDragIn = useCallback((e) => { handleDrag(e); setIsDragging(true); }, [handleDrag]);
    const handleDragOut = useCallback((e) => { handleDrag(e); setIsDragging(false); }, [handleDrag]);
    const handleDrop = useCallback((e) => {
        handleDrag(e);
        setIsDragging(false);
        if (e.dataTransfer.files?.length > 0) { onFileLoaded(e.dataTransfer.files[0]); e.dataTransfer.clearData(); }
    }, [handleDrag, onFileLoaded]);

    const onFileChange = useCallback((e) => {
        if (e.target.files?.[0]) { onFileLoaded(e.target.files[0]); }
    }, [onFileLoaded]);

    return (
        <div onClick={() => fileInputRef.current.click()} onDrop={handleDrop} onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag} className={`file-uploader ${isDragging ? 'drag-over' : ''}`}>
            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept=".log,.txt" />
            <p>{loading ? 'Parsing...' : 'Drag & drop a Klipper log file here, or click to select'}</p>
        </div>
    );
});

const FileViewer = memo(({ file }) => {
    if (!file) return <div className="viewer-placeholder">Select a file to view its content.</div>;
    const lines = useMemo(() => file.content.split('\n'), [file.content]);
    return (
        <div className="file-content">
            <table>
                <tbody>
                    {lines.map((line, index) => (
                        <tr key={index}>
                            <td className="line-number">{index + 1}</td>
                            <td className="line-text">{line}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

const DiffViewer = memo(({ html }) => {
    if (!html) return <div className="viewer-placeholder">Select two files and click "Compare" to generate a diff.</div>;
    return <div className="diff-content" dangerouslySetInnerHTML={{ __html: html }} />;
});

const FileSelector = memo(({ label, files, selectedValue, setSelected, onDownload, currentFile }) => (
    <div className="file-selector-group">
        <label className="file-selector-label">{label}</label>
        <select value={selectedValue} onChange={(e) => setSelected(e.target.value)}>
            {files.map(file => (<option key={file.filename} value={file.filename}>{file.filename}</option>))}
        </select>
        <button onClick={() => onDownload(currentFile)} disabled={!currentFile} className="download-button" title="Download this file">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
    </div>
));


// ===================================================================
//  2. TABBED RESULTS COMPONENT
// ===================================================================

const ResultsTabs = memo((props) => {
    const {
        results,
        activeTab, // Receive activeTab from parent
        selectedShutdown, setSelectedShutdown, currentShutdownFile,
        selectedConfig, setSelectedConfig, currentConfigFile,
        selectedConfig2, setSelectedConfig2,
        selectedGCode, setSelectedGCode, currentGCodeFile,
        diffOutput, onCompare, onClearCompare, onDownload
    } = props;

    const tabContainerRef = useRef(null);

    // Scroll to top when the active tab changes
    useEffect(() => {
        if (tabContainerRef.current) {
            tabContainerRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const tabsData = [
        { id: 'shutdowns', label: 'Shutdown Logs', count: results.shutdowns.length },
        { id: 'configs', label: 'Configs', count: results.configs.length },
        { id: 'gcode', label: 'G-Code', count: results.gcodeFiles.length },
    ];

    return (
        <div className="tab-container" ref={tabContainerRef}>
            <nav className="tab-navigation">
                {tabsData.map(tab => (
                    // Update window hash on click
                    <button key={tab.id} onClick={() => window.location.hash = tab.id} className={activeTab === tab.id ? 'active' : ''}>
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </nav>

            {activeTab === 'shutdowns' && (
                <>
                    <div className="controls-row">
                        {results.shutdowns.length > 0
                            ? <FileSelector files={results.shutdowns} selectedValue={selectedShutdown} setSelected={setSelectedShutdown} onDownload={onDownload} currentFile={currentShutdownFile} label="Shutdown:" />
                            : <div className="viewer-placeholder">No shutdown logs were found in this file.</div>
                        }
                    </div>
                    {results.shutdowns.length > 0 && <FileViewer file={currentShutdownFile} />}
                </>
            )}
            {activeTab === 'configs' && (
                <>
                    <div className="controls-row">
                        <FileSelector files={results.configs} selectedValue={selectedConfig} setSelected={setSelectedConfig} onDownload={onDownload} currentFile={currentConfigFile} label="Config:" />
                        {results.configs.length > 1 && (
                            <div className="compare-group">
                                <label className="file-selector-label">Compare with:</label>
                                <select value={selectedConfig2} onChange={(e) => setSelectedConfig2(e.target.value)}>
                                    <option value="">-- Select a file --</option>
                                    {results.configs.filter(f => f.filename !== selectedConfig).map(file => <option key={file.filename} value={file.filename}>{file.filename}</option>)}
                                </select>
                                <div className="compare-controls">
                                    <button onClick={onCompare} disabled={!selectedConfig2} className="compare-button">{diffOutput ? 'Update Compare' : 'Start Compare'}</button>
                                    {diffOutput && (<button onClick={onClearCompare} className="clear-button">Clear</button>)}
                                </div>
                            </div>
                        )}
                    </div>
                    {diffOutput ? <DiffViewer html={diffOutput} /> : <FileViewer file={currentConfigFile} />}
                </>
            )}
            {activeTab === 'gcode' && (
                <>
                    <div className="controls-row">
                         {results.gcodeFiles.length > 0
                            ? <FileSelector files={results.gcodeFiles} selectedValue={selectedGCode} setSelected={setSelectedGCode} onDownload={onDownload} currentFile={currentGCodeFile} label="G-Code File:" />
                            : <div className="viewer-placeholder">No G-Code files were found in this file.</div>
                         }
                     </div>
                    {results.gcodeFiles.length > 0 && <FileViewer file={currentGCodeFile} />}
                </>
            )}
        </div>
    );
});


// ===================================================================
//  3. MAIN APPLICATION COMPONENT
// ===================================================================

function App() {
    // --- State Management ---
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('shutdowns'); // Lifted state
    const [selectedShutdown, setSelectedShutdown] = useState('');
    const [selectedConfig, setSelectedConfig] = useState('');
    const [selectedConfig2, setSelectedConfig2] = useState('');
    const [selectedGCode, setSelectedGCode] = useState('');
    const [diffOutput, setDiffOutput] = useState(null);
    const workerRef = useRef(null);

    // --- Theme Management ---
    const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const [theme, setTheme] = useState(systemPrefersDark ? 'dark' : 'light');
    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-mode' : '';
    }, [theme]);
    const toggleTheme = useCallback(() => setTheme(prev => prev === 'dark' ? 'light' : 'dark'), []);

    // Effect to handle URL hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const validTabs = ['shutdowns', 'configs', 'gcode'];
            if (validTabs.includes(hash)) {
                setActiveTab(hash);
            } else {
                setActiveTab('shutdowns');
            }
        };

        // Initial check
        handleHashChange();

        // Listen for changes
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);


    // --- Core Logic & Handlers ---
    useEffect(() => {
        workerRef.current = new Worker('logextract.js');
        workerRef.current.onmessage = (e) => {
            setLoading(false);
            if (e.data.success) {
                const res = e.data.results;
                setResults(res);
                setError(null);
                setDiffOutput(null);
                setSelectedShutdown(res.shutdowns[0]?.filename || '');
                setSelectedConfig(res.configs[0]?.filename || '');
                setSelectedGCode(res.gcodeFiles[0]?.filename || '');
                // Set initial state for compare dropdown
                setSelectedConfig2(res.configs.length > 1 ? '' : '');
            } else {
                setError(`Worker Error: ${e.data.error}`);
                setResults(null);
            }
        };
        workerRef.current.onerror = (err) => {
            setLoading(false);
            setError(`An unexpected error occurred in the parser worker: ${err.message}`);
        };
        return () => workerRef.current.terminate();
    }, []);

    // --- Handle File Loaded ---
    const handleFileLoaded = useCallback((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            setLoading(true);
            setError(null);
            setResults(null);
            setDiffOutput(null);
            workerRef.current.postMessage({ logContent: event.target.result, logname: file.name });
        };
        reader.onerror = () => { setError("Failed to read the file."); setLoading(false); };
        reader.readAsText(file);
    }, []);

    const handleDownload = useCallback((file) => {
        if (!file) return;
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    const handleCompare = useCallback(() => {
        const file1 = results?.configs.find(f => f.filename === selectedConfig);
        const file2 = results?.configs.find(f => f.filename === selectedConfig2);
        if (file1 && file2) {
            if (file1.content === file2.content) {
                const identicalHtml = `<div class="d2h-file-wrapper"><div class="d2h-file-header"><span class="d2h-file-name-wrapper"><svg aria-hidden="true" class="d2h-icon" height="16" viewBox="0 0 12 16" width="12"><path d="M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H2v12h8V5z"></path></svg><span class="d2h-file-name">${file1.filename}</span><span class="d2h-tag" style="background-color: #1f883d; color: white;">IDENTICAL</span></span></div><div class="d2h-file-diff"><div class="d2h-code-line d2h-info" style="text-align: center; padding: 10px;">The contents of the selected files are identical.</div></div></div>`;
                setDiffOutput(identicalHtml);
                return;
            }
            const diffPatch = Diff.createPatch(file1.filename, file1.content, file2.content, '', '', { context: 10000 });
            const diffHtml = Diff2Html.html(diffPatch, {
                drawFileList: false, matching: 'lines', outputFormat: 'side-by-side', matchWordsThreshold: 0.1
            });
            setDiffOutput(diffHtml);
        }
    }, [results, selectedConfig, selectedConfig2]);

    const handleClearCompare = useCallback(() => {
        setDiffOutput(null);
        setSelectedConfig2('');
    }, []);

    //  --- Create a new handler for the primary config selector  ---
    const handlePrimaryConfigChange = useCallback((newFilename) => {
        setSelectedConfig(newFilename);
        // When the primary file changes, always clear the diff
        if (diffOutput) {
            setDiffOutput(null);
            setSelectedConfig2('');
        }
    }, [diffOutput]);

    const getSelectedFile = (type, selectedFilename) => results?.[type]?.find(f => f.filename === selectedFilename) || null;

    return (
        <div className="app-container">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main>
                <FileUpload onFileLoaded={handleFileLoaded} loading={loading} />
                {error && <div className="error-message"><strong>Error: </strong> {error}</div>}
                {loading && !results && <p className="status-message">Processing log file... ⚙️</p>}
                {results && (
                    <ResultsTabs
                        results={results}
                        activeTab={activeTab}
                        selectedShutdown={selectedShutdown} setSelectedShutdown={setSelectedShutdown} currentShutdownFile={getSelectedFile('shutdowns', selectedShutdown)}
                        selectedConfig={selectedConfig}
                        setSelectedConfig={handlePrimaryConfigChange}
                        currentConfigFile={getSelectedFile('configs', selectedConfig)}
                        selectedConfig2={selectedConfig2} setSelectedConfig2={setSelectedConfig2}
                        selectedGCode={selectedGCode} setSelectedGCode={setSelectedGCode} currentGCodeFile={getSelectedFile('gcodeFiles', selectedGCode)}
                        diffOutput={diffOutput}
                        onCompare={handleCompare} onClearCompare={handleClearCompare} onDownload={handleDownload}
                    />
                )}
            </main>
        </div>
    );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
