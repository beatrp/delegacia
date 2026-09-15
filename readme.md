# Sistema Web: Portal de Denúncias Anônimas

**Portal de Denúncias Anônimas** é um protótipo acadêmico de uma plataforma web para registro e acompanhamento de denúncias, com uma área pública para o denunciante e uma área administrativa para gerenciamento dos registros.

## Tecnologias

- **HTML5** para a estrutura da aplicação.
- **Tailwind CSS** via CDN para estilização, responsividade e componentes visuais.
- **CSS3** para variáveis de tema, efeitos e ajustes personalizados.
- **JavaScript puro (Vanilla JS)** para validações, navegação, formulários, filtros e gerenciamento dos dados.
- **Font Awesome** para os ícones da interface.
- **Google Fonts – Plus Jakarta Sans** para a tipografia.
- **localStorage** para persistência dos registros no navegador.
- **FileReader API** para pré-visualização de evidências anexadas.

Não utiliza frameworks JavaScript, npm, backend ou banco de dados.


## Funcionalidades

### Área do denunciante

- Registro de denúncias sem identificação pessoal.
- Seleção de categoria, subcategoria e nível de urgência.
- Informações sobre data, local e descrição da ocorrência.
- Anexação de imagens e arquivos PDF.
- Geração de protocolo e chave de consulta.
- Consulta posterior do andamento da denúncia.
- Alternância entre tema escuro e claro.

### Área administrativa

- Visualização de indicadores das denúncias.
- Pesquisa e filtros por diferentes informações.
- Acesso aos detalhes de cada ocorrência.
- Alteração do status da denúncia.
- Registro de observações e histórico de atualizações.
- Visualização das evidências anexadas.

## Execução

O projeto pode ser executado diretamente em um navegador. Como utiliza recursos externos via CDN, é recomendado possuir conexão com a internet ao abrir a aplicação.

Por utilizar `localStorage`, os dados ficam armazenados apenas no navegador utilizado. O projeto é destinado a fins acadêmicos e demonstrativos e não substitui um sistema real de denúncias.
