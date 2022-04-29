import { Box, CircularProgress, circularProgressClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

const SectionLoaderWrapper = styled(Box)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -70%)',
    zIndex: 1301,
});

export const PageLoader = () => (
    <SectionLoaderWrapper>
        <Box sx={{position: 'relative'}}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }}
                size={100}
                thickness={3}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                    animationDuration: '700ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={100}
                thickness={2}
            />
        </Box>
    </SectionLoaderWrapper>
);
