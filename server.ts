import express from 'express';

import UserRoute from './routes/users.route.js';
import ProductsRoute from './routes/products.route.js';
import ReviewsRoute from './routes/reviews.route.js';
import SiteContentsRoute from './routes/siteContents.route.js';
import CampaignsRoute from './routes/campaigns.route.js';

import 'dotenv/config';

const app = express();
const PORT: number = parseInt(process.env.PORT!) || 3003;

app.use(express.json());

app.use('/api/users', UserRoute);
app.use('/api/products', ProductsRoute);
app.use('/api/reviews', ReviewsRoute);
app.use('/api/siteContent', SiteContentsRoute);
app.use('/api/campaigns', CampaignsRoute);

app.listen(PORT, '0.0.0.0', async (error?: Error) => {
	if (!error) {
		console.log(`Server listening on localhost:${PORT}`);
	} else {
		console.error(`Server error: ${error.message}`);
	}
});
