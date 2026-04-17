import './App.css';
import React, {useState, useRef, useEffect} from 'react';

const today = new Date();

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function formatDate(date) {
    // Immer als YYYY-MM-DD zurückgeben, egal ob String oder Date
    if (typeof date === 'string') {
        // Falls schon im richtigen Format
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
        // Falls ISO-String
        return new Date(date).toISOString().slice(0, 10);
    }
    return date.toISOString().slice(0, 10);
}

function formatDateLocal(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getNext14Days() {
    return Array.from({length: 14}, (_, i) => {
        const d = addDays(today, i);
        return {
            date: formatDateLocal(d),
            label: d.toLocaleDateString('de-DE', {weekday: 'short', day: '2-digit', month: '2-digit'})
        };
    });
}

function getPrev3Days() {
    return Array.from({length: 3}, (_, i) => {
        const d = addDays(today, -(3 - i));
        return {
            date: formatDateLocal(d),
            label: d.toLocaleDateString('de-DE', {weekday: 'short', day: '2-digit', month: '2-digit'})
        };
    });
}

function App() {
    const [meals, setMeals] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(formatDate(today));
    const [showDetail, setShowDetail] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const calendarRef = useRef(null);

    // Fetch meals from backend
    useEffect(() => {
        fetch('/api/meals')
            .then(res => res.json())
            .then(data => {
                setMeals(data);
                console.log('Meals geladen:', data);
            })
            .catch(() => setMeals([]));
    }, []);

    useEffect(() => {
        console.log('Aktueller Meals-State:', meals, 'SelectedDate:', selectedDate);
    }, [meals, selectedDate]);

    const prev3Days = getPrev3Days();
    const days = [...prev3Days, ...getNext14Days()];
    const mealsForDay = meals.filter(meal => formatDateLocal(meal.date) === formatDateLocal(selectedDate));
    const filteredMeals = mealsForDay.filter(meal =>
        meal.name.toLowerCase().includes(search.toLowerCase()) ||
        meal.description.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const el = calendarRef.current;
        if (!el) return;
        const updateArrows = () => {
            setShowLeftArrow(el.scrollLeft > 2);
            setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
        };
        updateArrows();
        el.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        return () => {
            el.removeEventListener('scroll', updateArrows);
            window.removeEventListener('resize', updateArrows);
        };
    }, []);

    // Scroll to today on mount
    useEffect(() => {
        const el = calendarRef.current;
        if (!el) return;
        setTimeout(() => {
            const todayElem = el.children[3]; // heute ist jetzt an Index 3
            if (todayElem) {
                // Scrolle so, dass heute ganz links steht
                el.scrollLeft = todayElem.offsetLeft - el.offsetLeft;
            }
        }, 50);
    }, []);

    const scrollCalendar = dir => {
        const el = calendarRef.current;
        if (!el) return;
        const scrollAmount = 120;
        el.scrollBy({left: dir * scrollAmount, behavior: 'smooth'});
    };

    const handleMealClick = meal => {
        setSelectedMeal(meal);
        setShowDetail(true);
    };
    const closeDetail = () => {
        setShowDetail(false);
    };

    return (
        <div className="lux-app">
            <header className="lux-header">
                <div className="lux-header-row">
                    <div className="lux-header-left">
                        <h1>Mensa-Sniper</h1>
                        <p className="lux-subtitle">Entdecken Sie die exklusivsten Gerichte Ihrer Mensa</p>
                    </div>
                    <div className="lux-header-search">
                        <input
                            type="text"
                            placeholder="Gericht suchen..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="lux-search-input lux-search-header"
                        />
                    </div>
                </div>
            </header>
            <main className="lux-main">
                <section className="lux-calendar">
                    <div className="lux-calendar-scroll-wrapper">
                        <button
                            className={`lux-calendar-arrow left${!showLeftArrow ? ' disabled' : ''}`}
                            onClick={() => {
                                if (showLeftArrow) scrollCalendar(-1);
                            }}
                            aria-label="Nach links scrollen"
                            disabled={!showLeftArrow}
                            tabIndex={0}
                        >
                            &#8592;
                        </button>
                        <ul className="lux-calendar-list" ref={calendarRef} tabIndex={0}>
                            {days.map(day => {
                                const hasMeals = meals.some(meal => formatDateLocal(meal.date) === formatDateLocal(day.date));
                                const isSelected = selectedDate === day.date;
                                const isToday = day.date === formatDateLocal(today);
                                return (
                                    <li
                                        key={day.date}
                                        className={`lux-calendar-item${isSelected ? ' selected' : ''}${!hasMeals ? ' disabled' : ''}${isToday ? ' today' : ''}`}
                                        onClick={() => {
                                            setSelectedDate(day.date);
                                            setSelectedMeal(null);
                                        }}
                                        tabIndex={0}
                                        aria-disabled={false}
                                    >
                                        <span className="lux-calendar-label">{day.label}</span>
                                        {isToday && <span className="lux-calendar-heute">Heute</span>}
                                    </li>
                                );
                            })}
                            {/* Spacer to preserve right padding visually */}
                            <li className="lux-calendar-spacer" aria-hidden="true"/>
                        </ul>
                        <button
                            className={`lux-calendar-arrow right${!showRightArrow ? ' disabled' : ''}`}
                            onClick={() => {
                                if (showRightArrow) scrollCalendar(1);
                            }}
                            aria-label="Nach rechts scrollen"
                            disabled={!showRightArrow}
                            tabIndex={0}
                        >
                            &#8594;
                        </button>
                    </div>
                </section>
                <section className="lux-meal-cards">
                    {filteredMeals.length === 0 ? (
                        <div className="lux-meal-card lux-meal-card-empty">
                            <span className="lux-placeholder">Keine Gerichte für diesen Tag verfügbar.</span>
                        </div>
                    ) : (
                        filteredMeals.map(meal => (
                            <div
                                key={meal.id}
                                className="lux-meal-card"
                                onClick={() => handleMealClick(meal)}
                            >
                                <div className="lux-meal-card-header">
                                    <span className="lux-meal-name">{meal.name}</span>
                                </div>
                                <div className="lux-meal-category-badge">{meal.category}</div>
                                <div className="lux-meal-location">
                                    <span className="lux-location-label">Ort:</span>
                                    <span className="lux-location-value">{meal.location || 'Unbekannt'}</span>
                                </div>
                                <div className="lux-meal-card-tags">
                                    {meal.tags && meal.tags.map(tag => (
                                        <span key={tag} className="lux-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </section>
                {showDetail && selectedMeal && (
                    <div className="lux-popup-overlay" onClick={closeDetail}>
                        <div className="lux-popup" onClick={e => e.stopPropagation()}>
                            <button className="lux-popup-close" onClick={closeDetail}>&times;</button>
                            <div className="lux-meal-detail">
                                <h3>{selectedMeal.name}</h3>
                                <p className="lux-meal-desc">{selectedMeal.description}</p>
                                <div className="lux-tags">
                                    {selectedMeal.tags && selectedMeal.tags.map(tag => (
                                        <span key={tag} className="lux-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <footer className="lux-footer">
                <span>&copy; {new Date().getFullYear()} Mensa-Sniper</span>
            </footer>
        </div>
    );
}

export default App;
