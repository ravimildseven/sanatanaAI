import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Youtube, BookOpen, PlayCircle } from "lucide-react";
import clsx from 'clsx';
import EbookViewer from './components/EbookViewer';
import { YOUTUBE_API_KEY } from './config/keys';

const CHANNEL_HANDLE = "@SanatanaKathaAI";
const BRAND = {
  name: "sanatanaAI",
  tagline: "Stories, shlokas, and satsang — powered by AI",
  youtubeChannelUrl: `https://www.youtube.com/${CHANNEL_HANDLE}`,
  contactUrl: "mailto:you@example.com",
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[''"""–—]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function App() {
  const [videos, setVideos] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    async function fetchVideos() {
      try {
        // First get channel ID from handle
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${CHANNEL_HANDLE}&type=channel&key=${YOUTUBE_API_KEY}`
        );
        const channelData = await channelRes.json();
        const channelId = channelData.items[0].id.channelId;

        // Then fetch videos using channel ID
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=3&order=date&type=video&key=${YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        const items = data.items.map((i) => {
          const title = i.snippet.title;
          const slug = slugify(title);
          return {
            videoId: i.id.videoId,
            title,
            description: i.snippet.description || "",
            thumbnail: i.snippet.thumbnails.high.url,
            slug,
          };
        });
        setVideos(items);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
    fetchVideos();
  }, []);

  const active = videos[activeIdx] || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {BRAND.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {BRAND.tagline}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#watch"
              className="rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              Start Watching
            </a>
            <a
              href={BRAND.youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1"
            >
              YouTube Channel <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {videos.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Video */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl">
                <iframe
                  src={`https://www.youtube.com/embed/${active.videoId}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  title={active.title}
                />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">{active.title}</h2>
              <p className="mt-2 text-gray-600">{active.description}</p>

              {/* PDF Section */}
              <div className="mt-8">
                <EbookViewer videoTitle={active.title} />
              </div>
            </div>

            {/* Video List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">More Videos</h3>
              {videos.map((video, idx) => (
                <motion.button
                  key={video.videoId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={clsx(
                    "w-full text-left p-4 rounded-xl transition-all",
                    idx === activeIdx
                      ? "bg-orange-50 ring-1 ring-orange-600/20"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => setActiveIdx(idx)}
                >
                  <div className="aspect-video mb-3 rounded-lg overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-gray-900">{video.title}</h4>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-md bg-orange-50 text-orange-700"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Loading videos...
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {BRAND.name}
        </div>
      </footer>
    </div>
  );
}