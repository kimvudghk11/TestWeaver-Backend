class CsvExporter {
    export(data) {
        if (!data || !data.length) {
            throw new Error("CSV export failed: no rows.");
        }

        const headers = Object.keys(data[0]);
        const lines = [];

        lines.push(headers.join(","));

        for (const row of data) {
            const line = headers.map(h => {
                const v = row[h];
                return v != null ? String(v) : "";
            }).join(",");
            lines.push(line);
        }

        return lines.join("\n");
    }
}

module.exports = CsvExporter;
