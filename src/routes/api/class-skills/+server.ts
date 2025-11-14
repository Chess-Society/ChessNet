import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock data para desarrollo local - relación class_skills
let mockClassSkills = [
  // Principiantes Mañana (mock-class-1) - Skills básicas
  { id: 'csk-1', class_id: 'mock-class-1', skill_id: 'mock-skill-1', owner_id: 'dev-user-123', assigned_at: '2024-01-15T10:00:00Z', active: true, order: 1 }, // Movimiento de Peones
  { id: 'csk-2', class_id: 'mock-class-1', skill_id: 'mock-skill-2', owner_id: 'dev-user-123', assigned_at: '2024-01-20T10:00:00Z', active: true, order: 2 }, // Enroque
  
  // Intermedios Tarde (mock-class-2) - Skills intermedias
  { id: 'csk-3', class_id: 'mock-class-2', skill_id: 'mock-skill-2', owner_id: 'dev-user-123', assigned_at: '2024-01-10T17:00:00Z', active: true, order: 1 }, // Enroque
  { id: 'csk-4', class_id: 'mock-class-2', skill_id: 'mock-skill-3', owner_id: 'dev-user-123', assigned_at: '2024-01-15T17:00:00Z', active: true, order: 2 }, // Táctica: Clavada
  { id: 'csk-5', class_id: 'mock-class-2', skill_id: 'mock-skill-4', owner_id: 'dev-user-123', assigned_at: '2024-01-20T17:00:00Z', active: true, order: 3 }, // Táctica: Tenedor
  
  // Avanzados Fin de Semana (mock-class-3) - Skills avanzadas
  { id: 'csk-6', class_id: 'mock-class-3', skill_id: 'mock-skill-4', owner_id: 'dev-user-123', assigned_at: '2024-01-05T09:00:00Z', active: true, order: 1 }, // Táctica: Tenedor
  { id: 'csk-7', class_id: 'mock-class-3', skill_id: 'mock-skill-5', owner_id: 'dev-user-123', assigned_at: '2024-01-10T09:00:00Z', active: true, order: 2 }, // Final: Rey y Torre vs Rey
  { id: 'csk-8', class_id: 'mock-class-3', skill_id: 'mock-skill-6', owner_id: 'dev-user-123', assigned_at: '2024-01-15T09:00:00Z', active: true, order: 3 }, // Apertura: Italiana
  
  // Pequeños Ajedrecistas (mock-class-4) - Skills básicas adaptadas
  { id: 'csk-9', class_id: 'mock-class-4', skill_id: 'mock-skill-1', owner_id: 'dev-user-123', assigned_at: '2024-02-10T16:00:00Z', active: true, order: 1 }, // Movimiento de Peones
  
  // Jóvenes Talentos (mock-class-5) - Skills intermedias/avanzadas
  { id: 'csk-10', class_id: 'mock-class-5', skill_id: 'mock-skill-3', owner_id: 'dev-user-123', assigned_at: '2024-02-05T18:00:00Z', active: true, order: 1 }, // Táctica: Clavada
  { id: 'csk-11', class_id: 'mock-class-5', skill_id: 'mock-skill-4', owner_id: 'dev-user-123', assigned_at: '2024-02-08T18:00:00Z', active: true, order: 2 }, // Táctica: Tenedor
  { id: 'csk-12', class_id: 'mock-class-5', skill_id: 'mock-skill-5', owner_id: 'dev-user-123', assigned_at: '2024-02-12T18:00:00Z', active: true, order: 3 }  // Final: Rey y Torre vs Rey
];

export const GET: RequestHandler = async ({ url }) => {
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: API /api/class-skills GET - Returning mock data');
    
    const classId = url.searchParams.get('class_id');
    const skillId = url.searchParams.get('skill_id');
    
    let filteredData = mockClassSkills.filter(cs => cs.owner_id === 'dev-user-123');
    
    if (classId) {
      filteredData = filteredData.filter(cs => cs.class_id === classId);
    }
    
    if (skillId) {
      filteredData = filteredData.filter(cs => cs.skill_id === skillId);
    }
    
    // Ordenar por order si es para una clase específica
    if (classId) {
      filteredData.sort((a, b) => a.order - b.order);
    }
    
    return json({ class_skills: filteredData });
  }
  
  return json({ class_skills: [] });
};

export const POST: RequestHandler = async ({ request, url }) => {
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: API /api/class-skills POST - Creating mock skill assignment');
    
    try {
      const body = await request.json();
      const { class_id, skill_id, order } = body;
      
      if (!class_id || !skill_id) {
        return json({ error: 'class_id and skill_id are required' }, { status: 400 });
      }
      
      // Verificar si ya existe la asignación
      const existingAssignment = mockClassSkills.find(
        cs => cs.class_id === class_id && cs.skill_id === skill_id && cs.active
      );
      
      if (existingAssignment) {
        return json({ error: 'Skill is already assigned to this class' }, { status: 409 });
      }
      
      // Calcular orden automáticamente si no se proporciona
      const classSkills = mockClassSkills.filter(cs => cs.class_id === class_id && cs.active);
      const nextOrder = order || (Math.max(...classSkills.map(cs => cs.order), 0) + 1);
      
      // Crear nueva asignación
      const newAssignment = {
        id: `csk-${Date.now()}`,
        class_id,
        skill_id,
        owner_id: 'dev-user-123',
        assigned_at: new Date().toISOString(),
        active: true,
        order: nextOrder
      };
      
      mockClassSkills.push(newAssignment);
      
      console.log('✅ DEV MODE: Skill assigned successfully:', newAssignment);
      return json({ class_skill: newAssignment });
      
    } catch (error) {
      console.error('❌ Error in class-skills POST:', error);
      return json({ error: 'Invalid request body' }, { status: 400 });
    }
  }
  
  return json({ error: 'Not implemented for production' }, { status: 501 });
};

export const DELETE: RequestHandler = async ({ url }) => {
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: API /api/class-skills DELETE - Removing mock skill assignment');
    
    const classId = url.searchParams.get('class_id');
    const skillId = url.searchParams.get('skill_id');
    
    if (!classId || !skillId) {
      return json({ error: 'class_id and skill_id are required' }, { status: 400 });
    }
    
    // Encontrar y desactivar la asignación
    const assignmentIndex = mockClassSkills.findIndex(
      cs => cs.class_id === classId && cs.skill_id === skillId && cs.active
    );
    
    if (assignmentIndex === -1) {
      return json({ error: 'Skill assignment not found' }, { status: 404 });
    }
    
    // Marcar como inactiva en lugar de eliminar
    mockClassSkills[assignmentIndex].active = false;
    
    console.log('✅ DEV MODE: Skill unassigned successfully');
    return json({ message: 'Skill unassigned successfully' });
  }
  
  return json({ error: 'Not implemented for production' }, { status: 501 });
};

export const PUT: RequestHandler = async ({ request, url }) => {
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: API /api/class-skills PUT - Updating skill order');
    
    try {
      const body = await request.json();
      const { class_id, skills_order } = body; // skills_order: [{ skill_id, order }]
      
      if (!class_id || !skills_order || !Array.isArray(skills_order)) {
        return json({ error: 'class_id and skills_order array are required' }, { status: 400 });
      }
      
      // Actualizar el orden de las skills
      skills_order.forEach(({ skill_id, order }) => {
        const assignmentIndex = mockClassSkills.findIndex(
          cs => cs.class_id === class_id && cs.skill_id === skill_id && cs.active
        );
        
        if (assignmentIndex !== -1) {
          mockClassSkills[assignmentIndex].order = order;
        }
      });
      
      console.log('✅ DEV MODE: Skills order updated successfully');
      return json({ message: 'Skills order updated successfully' });
      
    } catch (error) {
      console.error('❌ Error in class-skills PUT:', error);
      return json({ error: 'Invalid request body' }, { status: 400 });
    }
  }
  
  return json({ error: 'Not implemented for production' }, { status: 501 });
};
