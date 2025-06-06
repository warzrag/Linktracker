import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createSimpleDemo() {
  try {
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('demo123', 12)

    // Créer l'utilisateur demo
    const user = await prisma.user.upsert({
      where: { email: 'demo@getallmylinks.com' },
      update: {},
      create: {
        email: 'demo@getallmylinks.com',
        password: hashedPassword,
        username: 'demo',
        name: 'Demo User',
        bio: 'gratuit pour les prochaines 24h'
      }
    })

    console.log('✅ Utilisateur demo créé avec succès !')
    console.log('📧 Email: demo@getallmylinks.com')
    console.log('🔑 Mot de passe: demo123')
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur demo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSimpleDemo()