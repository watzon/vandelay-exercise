/**
 * Parses similarly structured CSVs into JSON
 */
class CSVParser {
    static get header_items() {
        return [
            'First name', 'Middle name', 'Last name', 'Address 1 line 1', 'Address 1 line 2',
            'Address 1 city', 'Address 1 state', 'Address 1 zip', 'Address 2 line 1',
            'Address 2 line 2', 'Address 2 city', 'Address 2 state', 'Address 2 zip', 
            'Phone 1 number', 'Phone 1 type', 'Phone 2 number', 'Phone 2 type',
            'Phone 3 number', 'Phone 3 type', 'License number', 'Last update date'
        ]
    }

    static parse(input) {
        const rows = input.split(/\r?\n/)
        let records = []
        let failed = []

        for (const [i, line] of rows.entries()) {
            const columns = line.split(',')
            if (i === 0) {
                // Validate the header
                this._validateHeader(columns)
                continue
            }

            let record = {
                addresses: [],
                phones: []
            }
            
            record.firstName = columns[0]
            record.middleName = columns[1]
            record.lastName = columns[2]
            
            const addressOne = this._createAddressRecord(...columns.slice(3, 8))
            const addressTwo = this._createAddressRecord(...columns.slice(9, 13))

            if (addressOne) record.addresses.push(addressOne)
            if (addressTwo) record.addresses.push(addressTwo)

            for (const j of [13, 15, 17]) {
                const phone = this._createPhoneRecord(columns[j], columns[j + 1])
                if (phone) record.phones.push(phone)
            }

            const license = columns[19]
            record.license = license
            const valid = this._validateLicense(license)

            record.lastUpdate = columns[20]

            if (valid) {
                records.push(record)
            } else {
                failed.push(record)
            }
        }

        let { succeeded, merged } = this._dedup(records)
        return { succeeded, failed, merged }
    }

    static _dedup(records) {
        let succeeded = []
        const map = records.reduce((a, x, i) => {
            if (!a[x.license]) a[x.license] = []
            a[x.license].push(i)
            return a
        }, {})

        for (let indexes of Object.values(map)) {
            if (indexes.length > 1) {
                const dups = indexes.map(x => records[x])
                const sorted = dups.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate))
                let merged = sorted[0]
                for (let other of sorted.slice(1, sorted.length)) {
                    merged.phones = merged.phones.concat(other.phones)
                    merged.addresses = merged.addresses.concat(other.addresses)
                }
                succeeded.push(merged)
            } else {
                succeeded.push(records[indexes[0]])
            }
        }

        const merged = records.length - succeeded.length
        return { succeeded, merged }
    }

    static _createAddressRecord(lineOne, lineTwo, city, state, zip) {
        if (!this.someValid(...arguments)) return

        const record = {
            lineOne,
            lineTwo,
            city,
            state,
            zip
        }

        return record
    }

    static _createPhoneRecord(number, type) {
        if (!this.someValid(...arguments)) return
        
        number = this._formatPhoneNumber(number)
        const record = {
            number,
            type
        }

        return record
    }

    static _validateHeader(columns) {
        if (columns.length !== 21)
            throw new Error(`Parse error: expected 21 columns, got ${columns.length}`)

        for (let [i, column] in columns.entries()) {
            if (this.header_items[i].toLowerCase() !== column.toLowerCase()) {
                throw new Error(`Parse error: unknown column ${column}`)
            }
        }
    }

    static _formatPhoneNumber(number) {
        if (number.match(/\(\d{3}\) \d{3}-\d{4}/)) {
            // Already formatted correctly
            return number
        }

        let cleaned = number.replace(/\D/g, '')

        const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/)
        
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        }

        return undefined
    }

    static _validateLicense(number) {
        if (!number || number.length !== 10) return false
        const numbers = number.split('').map(i => Number(i))
        const add = (acc, a) => acc + a
        const sum = numbers.slice(0, 9).reduce(add, 0)
        const mod = sum % 10
        return mod === numbers[9]
    }

    static someValid(...items) {
        if (!items.every(x => !!x)) {
            return false
        }
        return true
    }
}

module.exports = CSVParser
