import React, { useEffect, useState } from 'react';

const Home = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('AZ'); // Početni odabir sortiranja

    const handleSortChange = (event) => {
        const selectedSortOrder = event.target.value;
        setSortOrder(selectedSortOrder);
    };



    // Funkcija za dohvaćanje podataka iz API-ja
    const fetchShops = async () => {
        try {
            var url;
            if(sortOrder === 'AZ')
                url = 'http://localhost:8080/home/getShopsAZ'
            else if(sortOrder === 'ZA')
                url = 'http://localhost:8080/home/getShopsZA';

            const response = await fetch(url);  // API endpoint za dohvat trgovina
            if (!response.ok) {
                throw new Error('Failed to fetch data');  // Ako status nije OK, baci pogrešku
            }
            const data = await response.json();  // Pretvori odgovor u JSON

            setShops(data);  // Postavi podatke u state
            data.forEach(shop => {
                console.log(`ID: ${shop.id}, Shopname: ${shop.shopname}`);
            });
            setLoading(false);  // Promijeni stanje učitavanja
        } catch (error) {
            console.error('Error fetching shops:', error);
            setLoading(false);  // Postavi loading na false
        }
    };

    useEffect(() => {
        fetchShops();
    }, [sortOrder]);

    if (loading) {
        return <div>Loading...</div>;  // Prikazivanje loading indikatora dok se podaci učitavaju
    }

    return (
        <div>
            <form>
                <label>
                    Sortiraj po:
                    <select value={sortOrder} onChange={handleSortChange}>
                        <option value="AZ">nazivu A-Z</option>
                        <option value="ZA">nazivu Z-A</option>
                    </select>
                </label>
            </form>

            <h1>Shops</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Shop Name</th>
                </tr>
                </thead>
                <tbody>
                {shops.map(shop => (
                    <tr key={shop.id}>
                        <td>{shop.id}</td>
                        <td>{shop.shopName}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;