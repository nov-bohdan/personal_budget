const db = require('./db');
const {Envelope} = require('./envelopeModel');

class EnvelopeTable {
    static async getAllEnvelopes() {
        const response = await db.pool.query('SELECT * FROM envelopes');
        return response.rows;
    }

    static async getEnvelopeByCategory(category) {
        const response = await db.pool.query(`SELECT * FROM envelopes
            WHERE category = $1`, [category]);
        return response.rows[0];
    }

    static async saveNewEnvelope(envelope) {
        const response = await db.pool.query(`INSERT INTO envelopes
            (category, budget, money_amount)
            VALUES ($1, $2, $3)
            RETURNING *`, [envelope.category, envelope.budget, envelope.moneyAmount]);
        return response.rows[0];
    }

    static async updateEnvelopeMoneyAmount(envelope) {
        console.log(`Updating envelope`)
        console.log(envelope);
        const response = await db.pool.query(`UPDATE envelopes
            SET money_amount = $1
            WHERE id = $2
            RETURNING *`, [envelope.moneyAmount, envelope.id]);
        if (response.rowCount === 0) {
            throw new Error('Error while updating envelope: ' + JSON.stringify(envelope));
        }
        return response.rows[0];
    }

    static async deleteEnvelopeById(id) {
        console.log(`Deleting id ${id}`);
        const response = await db.pool.query(`DELETE FROM envelopes
            WHERE id=$1`, [id]);
        if (response.rowCount !== 0) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = EnvelopeTable