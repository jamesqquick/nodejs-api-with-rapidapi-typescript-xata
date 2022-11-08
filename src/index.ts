import express, { Express, Request, Response, urlencoded } from 'express';
import dotenv from 'dotenv';
import { getXataClient, Job } from './xata';

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 3000;
const xata = getXataClient();

type MyResponse<T> = { err: string } | { data: T };

app.get('/api/jobs', async (_: Request, res: Response<MyResponse<Job[]>>) => {
  try {
    const jobs = await xata.db.job.getAll();
    return res.status(200).json({ data: jobs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: 'Something went wrong' });
  }
});

app.post(
  '/api/jobs',
  async (req: Request<{}, {}, Job>, res: Response<MyResponse<Job>>) => {
    const job = req.body;
    try {
      const createdJob = await xata.db.job.create(job);
      return res.status(201).json({ data: createdJob });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ err: 'Something bad happened' });
    }
  }
);

app.put(
  '/api/jobs/:id',
  async (
    req: Request<{ id: string }, {}, Job>,
    res: Response<MyResponse<Job>>
  ) => {
    const job = req.body;
    const id = req.params.id;
    try {
      const updatedJob = (await xata.db.job.update(id, job)) as Job;

      if (!updatedJob) {
        return res.status(404).json({ err: 'Job not found' });
      }

      return res.status(200).json({ data: updatedJob });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ err: 'Something bad happened' });
    }
  }
);

app.delete(
  '/api/jobs/:id',
  async (
    req: Request<{ id: string }, {}, {}>,
    res: Response<MyResponse<Job>>
  ) => {
    const id = req.params.id;
    try {
      const deletedRecord = (await xata.db.job.delete(id)) as Job;

      if (!deletedRecord) {
        return res.status(404).json({ err: 'Job not found' });
      }

      return res.status(200).json({ data: deletedRecord });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ err: 'Something bad happened' });
    }
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Port: ${port}`);
});
