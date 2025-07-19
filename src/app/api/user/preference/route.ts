import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';


export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const { city } = await req.json();

    if (!city || typeof city !== 'string') {
      return new NextResponse('Cidade inválida', { status: 400 });
    }
    
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        preferredCity: city,
      },
    });

    return NextResponse.json({ message: 'Preferência salva com sucesso!' });

  } catch (error) {
    console.error('Erro ao salvar preferência:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}