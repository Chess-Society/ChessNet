const load = async ({ locals, url }) => {
  console.log("🏆 Create tournament page server load - User:", locals.user?.email || "none");
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Create tournament page - Providing mock data");
    const availableStudents = [
      {
        id: "mock-student-1",
        name: "Ana García Martín",
        rating: 1250,
        college: "Escuela de Ajedrez Madrid Centro",
        email: "ana.garcia@email.com"
      },
      {
        id: "mock-student-2",
        name: "Carlos López Silva",
        rating: 1180,
        college: "Escuela de Ajedrez Madrid Centro",
        email: "carlos.lopez@email.com"
      },
      {
        id: "mock-student-3",
        name: "María Rodríguez Pérez",
        rating: 1480,
        college: "Club de Ajedrez Barcelona",
        email: "maria.rodriguez@email.com"
      },
      {
        id: "mock-student-4",
        name: "David González Torres",
        rating: 1320,
        college: "Club de Ajedrez Barcelona",
        email: "david.gonzalez@email.com"
      },
      {
        id: "mock-student-5",
        name: "Laura Martínez Vega",
        rating: 1150,
        college: "Escuela de Ajedrez Madrid Centro",
        email: "laura.martinez@email.com"
      },
      {
        id: "mock-student-6",
        name: "Pedro Ruiz Sánchez",
        rating: 1200,
        college: "Club de Ajedrez Barcelona",
        email: "pedro.ruiz@email.com"
      },
      {
        id: "mock-student-7",
        name: "Isabel Torres Moreno",
        rating: 1350,
        college: "Escuela de Ajedrez Madrid Centro",
        email: "isabel.torres@email.com"
      },
      {
        id: "mock-student-8",
        name: "Miguel Ángel Fernández",
        rating: 1280,
        college: "Club de Ajedrez Barcelona",
        email: "miguel.fernandez@email.com"
      }
    ];
    const availableLocations = [
      "Escuela de Ajedrez Madrid Centro",
      "Club de Ajedrez Barcelona",
      "Centro Cultural Madrid Norte",
      "Biblioteca Municipal Sur",
      "Online - Plataforma ChessNet",
      "Aula Magna Universidad Complutense",
      "Salón de Actos IES Cervantes"
    ];
    return {
      user: locals.user,
      availableStudents,
      availableLocations
    };
  }
  return {
    user: locals.user,
    availableStudents: [],
    availableLocations: []
  };
};
export {
  load
};
