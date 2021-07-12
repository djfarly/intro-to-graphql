import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import { gql, useQuery } from "./api";
import { apis } from "./const";

const LAUNCHES_PER_PAGE = 6;

export function Launches() {
  const [launchesLimit, setLaunchesLimit] = useState(LAUNCHES_PER_PAGE);

  const { loading, data } = useQuery(
    gql`
      query ($launchesLimit: Int) {
        launchesPast(limit: $launchesLimit) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            wikipedia
            mission_patch_small
            flickr_images
          }
          rocket {
            rocket_name
          }
        }
      }
    `,
    {
      endpoint: apis.spaceX,
      variables: {
        launchesLimit,
      },
    }
  );
  return (
    <>
      <Grid container spacing={3}>
        {data?.launchesPast
          ? data.launchesPast.map(
              ({
                id,
                mission_name,
                launch_date_local,
                rocket,
                links,
                launch_site,
              }) => (
                <Grid item md={6} lg={4} key={id}>
                  <Card>
                    <CardMedia
                      style={{
                        height: 250,
                        backgroundSize: links.flickr_images?.[0]
                          ? "cover"
                          : "contain",
                      }}
                      image={
                        links.flickr_images?.[0] ?? links.mission_patch_small
                      }
                      title={mission_name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {mission_name}
                      </Typography>
                      <Typography variant="body2">
                        {rocket.rocket_name} launched{" "}
                        {new Date(launch_date_local).toLocaleDateString("en")}{" "}
                        from {launch_site.site_name_long}
                      </Typography>
                    </CardContent>
                    {links.wikipedia || links.article_link ? (
                      <CardActions>
                        {links.wikipedia ? (
                          <Button
                            size="small"
                            href={links.wikipedia}
                            target="_blank"
                          >
                            Wikipedia
                          </Button>
                        ) : null}
                        {links.article_link ? (
                          <Button
                            size="small"
                            href={links.article_link}
                            target="_blank"
                          >
                            Article
                          </Button>
                        ) : null}
                      </CardActions>
                    ) : null}
                  </Card>
                </Grid>
              )
            )
          : null}
      </Grid>
      <Box py={5}>
        <Button
          size="medium"
          variant="contained"
          disabled={loading}
          onClick={() =>
            setLaunchesLimit(
              (launchesLimit) => launchesLimit + LAUNCHES_PER_PAGE
            )
          }
        >
          {loading ? "Loading…" : "Load more"}
        </Button>
      </Box>
    </>
  );
}
