const wap = require('webapi-parser').WebApiParser
const path = require('path')

async function main() {
    // Parse RAML 1.0 file
    const inPath = path.join(__dirname, '../mod-source-record-manager/ramls/change-manager.raml')
    const model = await wap.raml10.parse(`file://${inPath}`)

    // // Get User.age property
    // const age = model.declares[0].properties[2]
    //
    // // Set age minimum to 18
    // age.range.withMinimum(18)
    //
    // // Set API baseUrl
    // model.encodes.withServer('127.0.0.1/api/{version}')

    const ramlPath = path.join(__dirname, './generated.raml')
    console.log('Generating file to:', ramlPath)

    // resolve the model
    const resModel = await wap.raml10.resolve(model)

    const api = resModel.encodes
    const endpoints = api.endPoints

    for (const endpoint of endpoints) {
        console.log(endpoint.path.value())
        for (const operation of endpoint.operations) {
            for (const response of operation.responses) {
                console.log(response.name.value())
                for (const payload of response.payloads) {
                    console.log(payload.schema.toJsonSchema)

                }
            }
        }
    }


// Generate RAML 1.0 file
    await wap.raml10.generateFile(resModel, `file://${ramlPath}`)

    const oasPath = path.join(__dirname, './oas.json')
    console.log('Generating file to:', oasPath)
    await wap.oas30.generateFile(resModel, `file://${oasPath}`)
}

main().catch(reason => {
    console.log(reason)
})