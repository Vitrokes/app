const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false
}

let mensagem = "Bem vindo ao App de Metas!"

let metas = [ meta ]

const cadastrarMeta = async () => {
     const meta = await input({message: "Digite a meta: "})

     if(meta.length == 0){
        mensagem = "A meta não pode ser vazia!"
        return
     }

     metas.push({value: meta, checked: false})
}

const listarMetas = async () => {

    if (metas.length === 0) {
         mensagem = "Nenhuma meta cadastrada!"
        return
    }

    const respostas = await checkbox({
        message: "Use: SETAS para mudar de meta, o ESPAÇO para marcar ou desmarcar e o ENTER para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0){
         mensagem = "Nenhuma meta selecionada!"
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })

     mensagem = "Meta(s) marcada(s) como concluida(s)!"
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0){
        mensagem = "Não existem metas realizadas :("
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return !meta.checked
    })

    if(abertas.length == 0){
         mensagem = "Não existem metas abertas :)"
        return
    }

    await select({
        message: "Metas abertas: " + abertas.length,
        choices: [...abertas]
    })

}

const deletarMetas = async () => {
    if (metas.length === 0) {
        mensagem = "Não há metas cadastradas para deletar!"
        return
    }

    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    const itemADeletar = await checkbox({
        message: "Selecionar item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itemADeletar.length == 0){
        mensagem = "Nenhum item selecionado para deletar"
        return
    }

    itemADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    while(true){
        mostrarMensagem()

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas Realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas Abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("Até a próxima")
                return
        }
    }
}
start()