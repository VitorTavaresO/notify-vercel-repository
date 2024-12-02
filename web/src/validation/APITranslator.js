export async function fetchGuardians() {
    try {
        const response = await fetch("http://localhost:8080/api/guardian");
        const data = await response.json();

        return data.map(item => ({
            id: item.id || null,
            name: item.name || "Nome desconhecido",
            phone: item.phone || "Telefone desconhecido",
            email: item.email || "Email desconhecido",
            studentName: item.studentName || "Aluno desconhecido",
            studentRA: item.studentRA || null,
            status: item.status || "Status desconhecido",
            course: item.course || "Curso desconhecido",
            courseYear: item.courseYear || "Ano desconhecido",
        }));
    } catch (error) {
        console.error("Erro ao buscar dados dos guardiões:", error);
        return [];
    }
}